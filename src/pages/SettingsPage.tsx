import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { setTheme, type Theme } from '../store/settingsSlice'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function SettingsPage() {
  const theme = useAppSelector((s) => s.settings.theme)
  const dispatch = useAppDispatch()

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    function handleAppInstalled() {
      setIsInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Appearance</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => dispatch(setTheme(t.value))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2"
            >
              <span className="text-sm">{t.label}</span>
              {theme === t.value && (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">App</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {isInstalled ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              App is installed on this device.
            </div>
          ) : installPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2"
            >
              <span className="text-sm">Install App</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              To install, use your browser's "Add to Home Screen" option.
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">About</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>This is an independent app and is not produced, maintained, or sponsored by The Church of Jesus Christ of Latter-day Saints.</p>
          <p>For reporting bugs or requesting features, please email <a href="mailto:oriel.absin@gmail.com?subject=CashCount%20PWA%20Feedback&body=Hi%2C%0A%0A%5BDescribe%20your%20bug%20or%20feature%20request%20here%5D%0A%0ADevice%3A%20%0ABrowser%3A%20" className="underline hover:text-gray-600 dark:hover:text-gray-300">oriel.absin@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  )
}
