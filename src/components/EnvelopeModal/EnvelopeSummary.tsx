import { formatCurrency } from '../../utils/currency'

interface Props {
  cashTotal: number
  coinsAmount: number
  chequeAmount: number
  total: number
}

export default function EnvelopeSummary({ cashTotal, coinsAmount, chequeAmount, total }: Props) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Summary</h3>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 divide-y divide-gray-200 dark:divide-gray-700">
        <div className="flex justify-between py-2 text-sm">
          <span>Cash</span>
          <span>{formatCurrency(cashTotal)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span>Coins</span>
          <span>{formatCurrency(coinsAmount)}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span>Cheque</span>
          <span>{formatCurrency(chequeAmount)}</span>
        </div>
        <div className="flex justify-between py-3 font-bold">
          <span>Envelope Total</span>
          <span className="text-lg">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
