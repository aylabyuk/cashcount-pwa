import { useTransition, animated } from '@react-spring/web'
import { useModalKeys } from '../../hooks/useModalKeys'
import { formatCurrency } from '../../utils/currency'
import { BILL_DENOMINATIONS, MODAL_TRANSITION } from '../../utils/constants'

interface Props {
  open: boolean
  date: string
  denomCounts: Record<number, number>
  cashSubtotal: number
  coinsTotal: number
  chequesTotal: number
  onClose: () => void
}

export default function DepositBreakdownModal({
  open,
  date,
  denomCounts,
  cashSubtotal,
  coinsTotal,
  chequesTotal,
  onClose,
}: Props) {
  useModalKeys(open, { onClose })

  const grandTotal = cashSubtotal + coinsTotal + chequesTotal
  const transitions = useTransition(open, MODAL_TRANSITION)

  return transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <animated.div
          className="fixed inset-0 bg-black/60"
          style={{ opacity: styles.backdropOpacity }}
          onClick={onClose}
        />
        <animated.div
          className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col"
          style={{
            opacity: styles.dialogOpacity,
            transform: styles.scale.to((s) => `scale(${s})`),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold">Deposit Slip Breakdown</h2>
              <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {/* Bills breakdown */}
            <div>
              <h3 className="text-sm font-semibold uppercase text-gray-400 dark:text-gray-500 mb-3">Bills</h3>
              <div className="space-y-2">
                {BILL_DENOMINATIONS.map((d) => {
                  const count = denomCounts[d]
                  if (count === 0) return null
                  return (
                    <div key={d} className="flex items-baseline gap-3">
                      <div className="text-2xl font-mono whitespace-nowrap">
                        <span className="text-gray-400 dark:text-gray-500 inline-block w-[4ch] text-right">${d}</span>
                        <span className="text-gray-400 dark:text-gray-500"> × </span>
                        <span className="font-semibold">{count}</span>
                      </div>
                      <div className="flex-1 border-b-2 border-dashed border-gray-300 dark:border-gray-600 translate-y-[-0.35em]" />
                      <span className="text-2xl font-mono font-semibold whitespace-nowrap">{formatCurrency(count * d * 100)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-baseline">
                <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">Cash Total</span>
                <span className="text-2xl font-mono font-bold">{formatCurrency(cashSubtotal)}</span>
              </div>
            </div>

            {/* Coins */}
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">Coins</span>
              <span className="text-2xl font-mono font-bold">{formatCurrency(coinsTotal)}</span>
            </div>

            {/* Cheques */}
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">Cheques</span>
              <span className="text-2xl font-mono font-bold">{formatCurrency(chequesTotal)}</span>
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600 flex justify-between items-baseline">
              <span className="text-xl font-bold">Grand Total</span>
              <span className="text-3xl font-mono font-bold">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {/* Bottom safe area */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </animated.div>
      </div>
    ) : null
  )
}
