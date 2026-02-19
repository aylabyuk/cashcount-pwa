import { useEffect, useRef } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAppSelector, useAppDispatch } from '../store'
import { setSessions } from '../store/sessionsSlice'
import type { CountingSession } from '../store/sessionsSlice'

export function useFirestoreSync() {
  const dispatch = useAppDispatch()
  const authStatus = useAppSelector((s) => s.auth.status)
  const unitId = useAppSelector((s) => s.auth.unit?.unitId ?? null)
  const unsubRef = useRef<Unsubscribe | null>(null)

  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current()
      unsubRef.current = null
    }

    if (authStatus !== 'ready' || !unitId) {
      dispatch(setSessions([]))
      return
    }

    const sessionsRef = collection(db, 'units', unitId, 'sessions')
    const q = query(sessionsRef, orderBy('date', 'desc'))

    unsubRef.current = onSnapshot(
      q,
      (snapshot) => {
        const sessions: CountingSession[] = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            date: data.date,
            envelopes: data.envelopes ?? [],
            status: data.status ?? 'active',
            createdBy: data.createdBy ?? undefined,
            lastUpdatedBy: data.lastUpdatedBy ?? undefined,
            recordedAt: data.recordedAt ?? undefined,
            recordedBy: data.recordedBy ?? undefined,
            batchNumber: data.batchNumber ?? undefined,
            depositedAt: data.depositedAt ?? undefined,
            depositInfo: data.depositInfo ?? undefined,
            noDonationsAt: data.noDonationsAt ?? undefined,
            noDonationsReason: data.noDonationsReason ?? undefined,
          }
        })
        dispatch(setSessions(sessions))
      },
      (error) => {
        console.error('Firestore snapshot error:', error)
      }
    )

    return () => {
      if (unsubRef.current) {
        unsubRef.current()
        unsubRef.current = null
      }
    }
  }, [authStatus, unitId, dispatch])
}
