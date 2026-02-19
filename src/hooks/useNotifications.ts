import { useState, useEffect, useCallback } from 'react'
import { getToken, deleteToken, onMessage, type Messaging } from 'firebase/messaging'
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db, messagingPromise, VAPID_KEY } from '../firebase'
import { useAppSelector } from '../store'

const STORAGE_KEY = 'cashcount_notifications_enabled'

export type NotificationStatus = 'loading' | 'unsupported' | 'denied' | 'enabled' | 'disabled'

export function useNotifications() {
  const [status, setStatus] = useState<NotificationStatus>('loading')
  const [messaging, setMessaging] = useState<Messaging | null>(null)
  const unitId = useAppSelector((s) => s.auth.unit?.unitId ?? null)
  const userEmail = useAppSelector((s) => s.auth.user?.email ?? null)

  // Initialize messaging and check status
  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('unsupported')
      return
    }

    messagingPromise.then((m) => {
      if (!m) {
        setStatus('unsupported')
        return
      }
      setMessaging(m)

      if (Notification.permission === 'denied') {
        setStatus('denied')
      } else if (localStorage.getItem(STORAGE_KEY) === 'true' && Notification.permission === 'granted') {
        setStatus('enabled')
      } else {
        setStatus('disabled')
      }
    })
  }, [])

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging || status !== 'enabled') return

    const unsub = onMessage(messaging, (payload) => {
      const data = payload.data || {}
      new Notification(data.title || 'CashCount', {
        body: data.body || 'You have a new notification',
        icon: '/icons/icon-192.png',
        tag: data.sessionId || 'cashcount',
      })
    })

    return unsub
  }, [messaging, status])

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    if (!messaging || !unitId || !userEmail || !VAPID_KEY) return false

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus('denied')
        return false
      }

      const swRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
        { scope: '/firebase-cloud-messaging-push-scope' }
      )

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      })

      if (token) {
        await setDoc(
          doc(db, 'units', unitId, 'fcmTokens', token),
          {
            token,
            email: userEmail,
            createdAt: serverTimestamp(),
          }
        )
      }

      localStorage.setItem(STORAGE_KEY, 'true')
      setStatus('enabled')
      return true
    } catch (error) {
      console.error('Failed to enable notifications:', error)
      return false
    }
  }, [messaging, unitId, userEmail])

  // Disable notifications
  const disableNotifications = useCallback(async () => {
    if (!messaging || !unitId || !VAPID_KEY) return

    try {
      const swRegistration = await navigator.serviceWorker.getRegistration(
        '/firebase-cloud-messaging-push-scope'
      )
      if (swRegistration) {
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: swRegistration,
        })
        if (token) {
          await deleteDoc(doc(db, 'units', unitId, 'fcmTokens', token))
          await deleteToken(messaging)
        }
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error)
    }

    localStorage.removeItem(STORAGE_KEY)
    setStatus('disabled')
  }, [messaging, unitId])

  return {
    status,
    isEnabled: status === 'enabled',
    enableNotifications,
    disableNotifications,
  }
}
