import { useInstallPrompt } from './useInstallPrompt'

export default function InstallAppSection() {
  const { isInstalled, canInstall, handleInstall } = useInstallPrompt()

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">App</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {isInstalled ? (
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            App is installed on this device.
          </div>
        ) : canInstall ? (
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
  )
}
