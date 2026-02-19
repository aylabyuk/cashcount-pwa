import { useState, useEffect, useRef } from 'react'
import { formatCurrency } from '../../utils/currency'

const MAX_COUNT = 50

interface Props {
  denomination: number
  count: number
  onChange: (count: number) => void
  disabled?: boolean
}

export default function DenominationRow({ denomination, count, onChange, disabled }: Props) {
  const subtotalCents = count * denomination * 100
  const [text, setText] = useState(String(count))
  const inputRef = useRef<HTMLInputElement>(null)
  const prevCount = useRef(count)

  useEffect(() => {
    setText(String(count))
    // Pulse the input when count changes via +/- buttons (not typing)
    if (count !== prevCount.current && inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.classList.remove('count-pulse')
      // Force reflow to restart animation
      void inputRef.current.offsetWidth
      inputRef.current.classList.add('count-pulse')
    }
    prevCount.current = count
  }, [count])

  return (
    <div className="flex items-center py-4 md:py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-b-0 gap-2">
      <span className="w-12 text-sm font-semibold shrink-0">${denomination}</span>

      <div className="flex items-center justify-center gap-1 flex-1 min-w-0">
        <button
          onClick={() => onChange(Math.max(0, count - 1))}
          disabled={disabled || count === 0}
          className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-xl md:text-lg font-bold text-red-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:hover:bg-transparent transition-all active:scale-90"
        >
          &minus;
        </button>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={text}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 2)
            setText(raw)
            const v = parseInt(raw, 10)
            onChange(!isNaN(v) ? Math.min(MAX_COUNT, v) : 0)
          }}
          onBlur={() => setText(String(count))}
          className="w-14 h-12 md:h-10 text-center text-lg md:text-base font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={() => onChange(Math.min(MAX_COUNT, count + 1))}
          disabled={disabled}
          className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-lg text-xl md:text-lg font-bold text-green-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:hover:bg-transparent transition-all active:scale-90"
        >
          +
        </button>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 w-16 text-right tabular-nums">
        {formatCurrency(subtotalCents)}
      </span>
    </div>
  )
}
