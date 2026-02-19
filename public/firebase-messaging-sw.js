/* eslint-disable no-undef */
// Push notification service worker for CashCount PWA.
// Handles background push events and notification click deep links.

self.addEventListener('push', (event) => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    return
  }

  // FCM wraps payload in a `data` field for data-only messages
  const payload = data.data || data
  const title = payload.title || 'CashCount'
  const options = {
    body: payload.body || 'You have a new notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-32.png',
    tag: payload.sessionId || 'cashcount',
    data: {
      sessionId: payload.sessionId,
      url: payload.url || '/',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  const url = data.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.focus()
          client.navigate(url)
          return
        }
      }
      // Otherwise open a new window
      return self.clients.openWindow(url)
    })
  )
})
