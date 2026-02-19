import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

export default function NotificationsSection() {
  const { status, isEnabled, enableNotifications, disableNotifications } = useNotifications()
  const [loading, setLoading] = useState(false)

  if (status === 'loading' || status === 'unsupported') return null

  const handleToggle = async () => {
    setLoading(true)
    try {
      if (isEnabled) {
        await disableNotifications()
      } else {
        await enableNotifications()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Notifications</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {status === 'denied' ? (
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            Notifications are blocked. Enable them in your browser settings.
          </div>
        ) : (
          <button
            onClick={handleToggle}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-black/2 dark:hover:bg-white/2 disabled:opacity-50"
          >
            <div className="text-left">
              <div>Push Notifications</div>
              <div className="text-gray-400 dark:text-gray-500 mt-0.5">
                {isEnabled ? 'Get notified when deposits need verification' : 'Enable to receive deposit alerts'}
              </div>
            </div>
            <div
              className={`relative w-9 h-5 rounded-full transition-colors ${
                isEnabled
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
