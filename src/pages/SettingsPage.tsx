import { useAppSelector, useAppDispatch } from '../store'
import { setTheme, type Theme } from '../store/settingsSlice'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export default function SettingsPage() {
  const theme = useAppSelector((s) => s.settings.theme)
  const dispatch = useAppDispatch()

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div>
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Appearance</h3>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => dispatch(setTheme(t.value))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-750"
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
    </div>
  )
}
