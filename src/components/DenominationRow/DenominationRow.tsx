import { formatCurrency } from '../../utils/currency'

interface Props {
  denomination: number
  count: number
  onChange: (count: number) => void
  disabled?: boolean
}

export default function DenominationRow({ denomination, count, onChange, disabled }: Props) {
  const subtotalCents = count * denomination * 100

  return (
    <div className="flex items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <span className="w-12 text-sm font-medium">${denomination}</span>
      <button
        onClick={() => onChange(Math.max(0, count - 1))}
        disabled={disabled || count === 0}
        className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold text-red-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:hover:bg-transparent"
      >
        &minus;
      </button>
      <span className="w-10 text-center font-mono text-base">{count}</span>
      <button
        onClick={() => onChange(count + 1)}
        disabled={disabled}
        className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold text-green-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 disabled:hover:bg-transparent"
      >
        +
      </button>
      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-mono">
        {formatCurrency(subtotalCents)}
      </span>
    </div>
  )
}
