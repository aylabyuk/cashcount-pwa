import { useMemo } from 'react'
import { type CountingSession, getSessionTotals } from '../../store/sessionsSlice'
import { formatCurrency } from '../../utils/currency'
import { BILL_DENOMINATIONS } from '../../utils/constants'

interface Props {
  session: CountingSession
}

const DENOMINATIONS = BILL_DENOMINATIONS

export default function TotalsSummary({ session }: Props) {
  const totals = getSessionTotals(session)

  const denomCounts: Record<number, number> = {
    100: totals.total100,
    50: totals.total50,
    20: totals.total20,
    10: totals.total10,
    5: totals.total5,
  }

  const chequeLines = useMemo(() => {
    const lines: { envelopeNum: number; amount: number }[] = []
    const sorted = [...session.envelopes].sort((a, b) => a.number - b.number)
    sorted.forEach((e, i) => {
      if (e.chequeAmount > 0) {
        lines.push({ envelopeNum: i + 1, amount: e.chequeAmount })
      }
    })
    return lines
  }, [session.envelopes])

  return (
    <div className="space-y-3">
      {/* Cash Bills */}
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
              {DENOMINATIONS.map((d) => {
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
                <td className="py-2 text-right font-mono">{formatCurrency(totals.totalCash)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Coins */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Coins</h3>
        </div>
        <div className="px-4 py-2 flex justify-between text-sm font-medium">
          <span>Coins Total</span>
          <span className="font-mono">{formatCurrency(totals.totalCoins)}</span>
        </div>
      </div>

      {/* Cheques */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Cheques</h3>
        </div>
        <div className="px-4">
          {chequeLines.length === 0 ? (
            <div className="py-2 text-sm text-gray-400 dark:text-gray-500">No cheques</div>
          ) : (
            <table className="w-full text-sm">
              <tbody className="text-gray-600 dark:text-gray-300">
                {chequeLines.map((line, i) => (
                  <tr key={i} className={i > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}>
                    <td className="py-1.5 text-gray-400 dark:text-gray-500">Env #{line.envelopeNum}</td>
                    <td className="py-1.5 text-right font-mono">{formatCurrency(line.amount)}</td>
                  </tr>
                ))}
              </tbody>
              {chequeLines.length > 1 && (
                <tfoot>
                  <tr className="border-t border-gray-200 dark:border-gray-600 font-medium">
                    <td className="py-2">Cheques Subtotal</td>
                    <td className="py-2 text-right font-mono">{formatCurrency(totals.totalCheques)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
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
