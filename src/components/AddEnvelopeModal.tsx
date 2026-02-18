import { useState } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { useMediaQuery } from '../hooks/useMediaQuery'
import DenominationRow from './DenominationRow'
import CurrencyField from './CurrencyField'
import { formatCurrency } from '../utils/currency'

interface Props {
  open: boolean
  onAdd: (envelope: {
    count100: number
    count50: number
    count20: number
    count10: number
    count5: number
    coinsAmount: number
    chequeAmount: number
  }) => void
  onCancel: () => void
}

export default function AddEnvelopeModal({ open, onAdd, onCancel }: Props) {
  const [count100, setCount100] = useState(0)
  const [count50, setCount50] = useState(0)
  const [count20, setCount20] = useState(0)
  const [count10, setCount10] = useState(0)
  const [count5, setCount5] = useState(0)
  const [coinsAmount, setCoinsAmount] = useState(0)
  const [chequeAmount, setChequeAmount] = useState(0)

  const isDesktop = useMediaQuery('(min-width: 640px)')

  const transitions = useTransition(open, {
    from: { backdropOpacity: 0, y: isDesktop ? 0 : 100, dialogOpacity: isDesktop ? 0 : 1, scale: isDesktop ? 0.95 : 1 },
    enter: { backdropOpacity: 1, y: 0, dialogOpacity: 1, scale: 1 },
    leave: { backdropOpacity: 0, y: isDesktop ? 0 : 100, dialogOpacity: isDesktop ? 0 : 1, scale: isDesktop ? 0.95 : 1 },
    config: { tension: 300, friction: 30 },
  })

  const cashTotalCents =
    count100 * 10000 +
    count50 * 5000 +
    count20 * 2000 +
    count10 * 1000 +
    count5 * 500

  const totalCents = cashTotalCents + coinsAmount + chequeAmount

  function resetFields() {
    setCount100(0)
    setCount50(0)
    setCount20(0)
    setCount10(0)
    setCount5(0)
    setCoinsAmount(0)
    setChequeAmount(0)
  }

  function handleAdd() {
    onAdd({ count100, count50, count20, count10, count5, coinsAmount, chequeAmount })
    resetFields()
  }

  function handleCancel() {
    resetFields()
    onCancel()
  }

  return transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <animated.div
          className="fixed inset-0 bg-black/40"
          style={{ opacity: styles.backdropOpacity }}
          onClick={handleCancel}
        />
        <animated.div
          className="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
          style={{
            opacity: styles.dialogOpacity,
            transform: isDesktop
              ? styles.scale.to((s) => `scale(${s})`)
              : styles.y.to((y) => `translateY(${y}%)`),
          }}
        >
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button onClick={handleCancel} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Cancel
            </button>
            <h2 className="text-base font-semibold">New Envelope</h2>
            <button
              onClick={handleAdd}
              disabled={totalCents === 0}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none"
            >
              Add
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Cash Bills */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cash Bills</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <DenominationRow denomination={100} count={count100} onChange={setCount100} />
                <DenominationRow denomination={50} count={count50} onChange={setCount50} />
                <DenominationRow denomination={20} count={count20} onChange={setCount20} />
                <DenominationRow denomination={10} count={count10} onChange={setCount10} />
                <DenominationRow denomination={5} count={count5} onChange={setCount5} />
              </div>
            </div>

            {/* Coins */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Coins</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <CurrencyField label="Coins" cents={coinsAmount} onChange={setCoinsAmount} />
              </div>
            </div>

            {/* Cheques */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cheques</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <CurrencyField label="Cheque" cents={chequeAmount} onChange={setChequeAmount} />
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex justify-between py-2 text-sm">
                  <span>Cash</span>
                  <span className="font-mono">{formatCurrency(cashTotalCents)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span>Coins</span>
                  <span className="font-mono">{formatCurrency(coinsAmount)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span>Cheque</span>
                  <span className="font-mono">{formatCurrency(chequeAmount)}</span>
                </div>
                <div className="flex justify-between py-3 font-bold">
                  <span>Envelope Total</span>
                  <span className="text-lg font-mono">{formatCurrency(totalCents)}</span>
                </div>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    ) : null
  )
}
