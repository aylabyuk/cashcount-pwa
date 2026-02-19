import { useState, useEffect } from 'react'
import { centsToDecimalString, parseCents } from '../../utils/currency'
import { CURRENCY_REGEX } from '../../utils/constants'

interface Props {
  label: string
  cents: number
  onChange: (cents: number) => void
  disabled?: boolean
}

export default function CurrencyField({ label, cents, onChange, disabled }: Props) {
  const [text, setText] = useState(() => centsToDecimalString(cents))

  useEffect(() => {
    if (parseCents(text) !== cents) {
      setText(centsToDecimalString(cents))
    }
  }, [cents])

  function handleChange(value: string) {
    if (value !== '' && !CURRENCY_REGEX.test(value)) return
    setText(value)
    onChange(parseCents(value))
  }

  return (
    <div className="flex items-center py-4 md:py-2.5 gap-2">
      <span className="w-12 text-sm font-semibold shrink-0">{label}</span>

      <div className="flex-1 flex justify-end">
        <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setText(centsToDecimalString(cents))}
        disabled={disabled}
        placeholder="0.00"
        className="w-20 h-12 md:h-10 text-center text-lg md:text-base font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      </div>
    </div>
  )
}
