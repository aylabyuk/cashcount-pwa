import { formatCurrency } from '../../utils/currency'
import { BILL_DENOMINATIONS } from '../../utils/constants'

interface Props {
  denomCounts: Record<number, number>
  cashSubtotal: number
}

export default function BillsTable({ denomCounts, cashSubtotal }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Bills</h3>
      </div>
      <div className="px-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-gray-400 dark:text-gray-500 uppercase">
              <th className="text-left font-medium py-1.5">Denom</th>
              <th className="text-center font-medium py-1.5">Count</th>
              <th className="text-right font-medium py-1.5">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-300">
            {BILL_DENOMINATIONS.map((d) => {
              const count = denomCounts[d]
              const dimmed = count === 0
              return (
                <tr key={d} className={`border-t border-gray-100 dark:border-gray-700 ${dimmed ? 'text-gray-300 dark:text-gray-600' : ''}`}>
                  <td className="py-1.5 font-mono">${d}</td>
                  <td className="py-1.5 text-center font-mono">{count}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(count * d * 100)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-600 font-medium">
              <td className="py-2" colSpan={2}>Cash Subtotal</td>
              <td className="py-2 text-right font-mono">{formatCurrency(cashSubtotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
