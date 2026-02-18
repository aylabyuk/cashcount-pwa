import { useState, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useAppSelector, useAppDispatch } from '../store'
import { setTheme, type Theme } from '../store/settingsSlice'
import { SPRING_MODAL } from '../utils/constants'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function SettingsPanel() {
  const theme = useAppSelector((s) => s.settings.theme)
  const dispatch = useAppDispatch()

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  })

  const springStyles = useSpring({
    height: collapsed ? 0 : contentHeight,
    opacity: collapsed ? 0 : 1,
    config: SPRING_MODAL,
  })

  useEffect(() => {
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
    <div className="border-t border-gray-200 dark:border-gray-700 shrink-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2"
      >
        <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Settings</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <animated.div style={{ ...springStyles, overflow: 'hidden' }}>
      <div ref={contentRef} className="px-4 pb-4 space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Theme</h3>
        <div className="flex gap-1">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => dispatch(setTheme(t.value))}
              className={`flex-1 text-xs py-1.5 rounded-md font-medium ${
                theme === t.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-black/2 dark:hover:bg-white/2'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">App</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {isInstalled ? (
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
              App is installed on this device.
            </div>
          ) : installPrompt ? (
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-black/2 dark:hover:bg-white/2"
            >
              <span>Install App</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          ) : (
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
              Use browser's "Add to Home Screen" to install.
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">About</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>This is an independent app and is not produced, maintained, or sponsored by The Church of Jesus Christ of Latter-day Saints.</p>
          <p>Bugs/features: <a href="mailto:oriel.absin@gmail.com?subject=CashCount%20PWA%20Feedback&body=Hi%2C%0A%0A%5BDescribe%20your%20bug%20or%20feature%20request%20here%5D%0A%0ADevice%3A%20%0ABrowser%3A%20" className="underline hover:text-gray-600 dark:hover:text-gray-300">oriel.absin@gmail.com</a></p>
        </div>
      </div>
      </div>
      </animated.div>
    </div>
  )
}
