import { type CountingSession, getSessionTotals } from '../store/sessionsSlice'
import { formatCurrency } from '../utils/currency'

interface Props {
  session: CountingSession
}

const DENOMINATIONS = [100, 50, 20, 10, 5] as const

export default function TotalsSummary({ session }: Props) {
  const totals = getSessionTotals(session)

  const denomCounts: Record<number, number> = {
    100: totals.total100,
    50: totals.total50,
    20: totals.total20,
    10: totals.total10,
    5: totals.total5,
  }

  return (
    <div className="space-y-3">
      {/* Cash Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cash</h3>
        </div>
        <div className="px-4 divide-y divide-gray-100 dark:divide-gray-700">
          {DENOMINATIONS.map((d) => (
            <div key={d} className="flex justify-between py-1.5 text-sm text-gray-500 dark:text-gray-400">
              <span>${d} x {denomCounts[d]}</span>
              <span className="font-mono">{formatCurrency(denomCounts[d] * d * 100)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 text-sm font-medium">
            <span>Cash Subtotal</span>
            <span className="font-mono">{formatCurrency(totals.totalCash)}</span>
          </div>
        </div>
      </div>

      {/* Coins & Cheques Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Coins & Cheques</h3>
        </div>
        <div className="px-4 divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex justify-between py-1.5 text-sm">
            <span>Coins</span>
            <span className="font-mono">{formatCurrency(totals.totalCoins)}</span>
          </div>
          <div className="flex justify-between py-1.5 text-sm">
            <span>Cheques</span>
            <span className="font-mono">{formatCurrency(totals.totalCheques)}</span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <span className="font-bold">Grand Total</span>
          <span className="text-lg font-bold font-mono">{formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}
