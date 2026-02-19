import { formatCurrency } from '../../utils/currency'

interface Props {
  total: number
}

export default function CoinsCard({ total }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Coins</h3>
      </div>
      <div className="px-4 py-2 flex justify-between text-sm font-medium">
        <span>Coins Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
