import { useState, useEffect, useRef } from 'react'

export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine)
  const [showReconnected, setShowReconnected] = useState(false)
  const wasOffline = useRef(false)

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      if (wasOffline.current) {
        setShowReconnected(true)
        setTimeout(() => setShowReconnected(false), 3000)
      }
      wasOffline.current = false
    }
    const handleOffline = () => {
      setOnline(false)
      wasOffline.current = true
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online && !showReconnected) return null

  return (
    <div
      className={`fixed top-14 left-0 right-0 z-9 px-4 py-1.5 text-center text-xs font-medium transition-all ${
        online
          ? 'bg-green-600 text-white'
          : 'bg-gray-700 text-white'
      }`}
    >
      {online ? 'Back online' : 'Offline — changes will sync when reconnected'}
    </div>
  )
}
