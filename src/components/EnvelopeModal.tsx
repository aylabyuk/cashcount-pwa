import { useState, useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useModalKeys } from '../hooks/useModalKeys'
import { useAppDispatch } from '../store'
import { updateEnvelope, type Envelope } from '../store/sessionsSlice'
import DenominationRow from './DenominationRow'
import CurrencyField from './CurrencyField'
import { formatCurrency } from '../utils/currency'

interface AddProps {
  mode: 'add'
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
  onClose: () => void
}

interface EditProps {
  mode: 'edit'
  open: boolean
  sessionId: string
  envelope: Envelope
  displayNumber: number
  disabled?: boolean
  onClose: () => void
}

type Props = AddProps | EditProps

export default function EnvelopeModal(props: Props) {
  const { mode, open, onClose } = props
  const dispatch = useAppDispatch()

  const [count100, setCount100] = useState(0)
  const [count50, setCount50] = useState(0)
  const [count20, setCount20] = useState(0)
  const [count10, setCount10] = useState(0)
  const [count5, setCount5] = useState(0)
  const [coinsAmount, setCoinsAmount] = useState(0)
  const [chequeAmount, setChequeAmount] = useState(0)

  const isDesktop = useMediaQuery('(min-width: 640px)')

  // Sync state from envelope prop in edit mode
  useEffect(() => {
    if (mode === 'edit' && open) {
      const e = props.envelope
      setCount100(e.count100)
      setCount50(e.count50)
      setCount20(e.count20)
      setCount10(e.count10)
      setCount5(e.count5)
      setCoinsAmount(e.coinsAmount)
      setChequeAmount(e.chequeAmount)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, open, mode === 'edit' ? props.envelope.id : null])

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

  const disabled = mode === 'edit' && !!props.disabled

  function resetFields() {
    setCount100(0)
    setCount50(0)
    setCount20(0)
    setCount10(0)
    setCount5(0)
    setCoinsAmount(0)
    setChequeAmount(0)
  }

  function handleClose() {
    if (mode === 'add') resetFields()
    onClose()
  }

  function handleAdd() {
    if (mode !== 'add') return
    props.onAdd({ count100, count50, count20, count10, count5, coinsAmount, chequeAmount })
    resetFields()
  }

  function dispatchUpdate(changes: Record<string, number>) {
    if (mode !== 'edit') return
    dispatch(updateEnvelope({ sessionId: props.sessionId, envelopeId: props.envelope.id, changes }))
  }

  // Wrap setters to also dispatch in edit mode
  function setField(setter: (v: number) => void, field: string) {
    return (value: number) => {
      setter(value)
      if (mode === 'edit') dispatchUpdate({ [field]: value })
    }
  }

  const onCount100 = setField(setCount100, 'count100')
  const onCount50 = setField(setCount50, 'count50')
  const onCount20 = setField(setCount20, 'count20')
  const onCount10 = setField(setCount10, 'count10')
  const onCount5 = setField(setCount5, 'count5')
  const onCoins = setField(setCoinsAmount, 'coinsAmount')
  const onCheque = setField(setChequeAmount, 'chequeAmount')

  const title = mode === 'edit' ? `Envelope #${props.displayNumber}` : 'New Envelope'

  useModalKeys(open, {
    onClose: handleClose,
    onConfirm: mode === 'add' && totalCents > 0 ? handleAdd : undefined,
  })

  return transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <animated.div
          className="fixed inset-0 bg-black/40"
          style={{ opacity: styles.backdropOpacity }}
          onClick={handleClose}
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
            <button onClick={handleClose} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              {mode === 'add' ? 'Cancel' : 'Close'}
            </button>
            <h2 className="text-base font-semibold">{title}</h2>
            {mode === 'add' ? (
              <button
                onClick={handleAdd}
                disabled={totalCents === 0}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:opacity-30 disabled:pointer-events-none"
              >
                Add
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Cash Bills */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cash Bills</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <DenominationRow denomination={100} count={count100} onChange={onCount100} disabled={disabled} />
                <DenominationRow denomination={50} count={count50} onChange={onCount50} disabled={disabled} />
                <DenominationRow denomination={20} count={count20} onChange={onCount20} disabled={disabled} />
                <DenominationRow denomination={10} count={count10} onChange={onCount10} disabled={disabled} />
                <DenominationRow denomination={5} count={count5} onChange={onCount5} disabled={disabled} />
              </div>
            </div>

            {/* Coins */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Coins</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <CurrencyField label="Coins" cents={coinsAmount} onChange={onCoins} disabled={disabled} />
              </div>
            </div>

            {/* Cheques */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">Cheques</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3">
                <CurrencyField label="Cheque" cents={chequeAmount} onChange={onCheque} disabled={disabled} />
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
