import { useState, useEffect } from 'react'
import { centsToDecimalString, parseCents } from '../utils/currency'

interface Props {
  label: string
  cents: number
  onChange: (cents: number) => void
  disabled?: boolean
}

export default function CurrencyField({ label, cents, onChange, disabled }: Props) {
  const [text, setText] = useState(() => centsToDecimalString(cents))

  useEffect(() => {
    setText(centsToDecimalString(cents))
  }, [cents])

  function handleChange(value: string) {
    // Allow only digits and one decimal point
    if (value !== '' && !/^\d*\.?\d{0,2}$/.test(value)) return
    setText(value)
    onChange(parseCents(value))
  }

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        placeholder="0.00"
        className="w-28 text-right px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-mono disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
