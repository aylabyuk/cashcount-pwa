import { useAppSelector, useAppDispatch } from '../store'
import { setTheme, type Theme } from '../store/settingsSlice'

const THEMES: { value: Theme; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export default function SettingsPanel() {
  const theme = useAppSelector((s) => s.settings.theme)
  const dispatch = useAppDispatch()

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4 shrink-0">
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
  )
}
