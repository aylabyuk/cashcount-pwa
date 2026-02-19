import { formatCurrency } from '../../utils/currency'

interface Props {
  total: number
}

export default function GrandTotalCard({ total }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex justify-between items-center">
        <span className="font-bold">Grand Total</span>
        <span className="text-lg font-bold">{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
