import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../store'
import { updateEnvelope, getEnvelopeCashTotal, type Envelope } from '../../store/sessionsSlice'

interface AddMode {
  mode: 'add'
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

interface EditMode {
  mode: 'edit'
  sessionId: string
  envelope: Envelope
  disabled?: boolean
  onClose: () => void
}

type Options = (AddMode | EditMode) & { open: boolean }

export function useEnvelopeForm(options: Options) {
  const { mode, open, onClose } = options
  const dispatch = useAppDispatch()

  const [count100, setCount100] = useState(0)
  const [count50, setCount50] = useState(0)
  const [count20, setCount20] = useState(0)
  const [count10, setCount10] = useState(0)
  const [count5, setCount5] = useState(0)
  const [coinsAmount, setCoinsAmount] = useState(0)
  const [chequeAmount, setChequeAmount] = useState(0)
  const [adding, setAdding] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  // Sync state from envelope prop in edit mode
  useEffect(() => {
    if (mode === 'edit' && open) {
      const e = options.envelope
      setCount100(e.count100)
      setCount50(e.count50)
      setCount20(e.count20)
      setCount10(e.count10)
      setCount5(e.count5)
      setCoinsAmount(e.coinsAmount)
      setChequeAmount(e.chequeAmount)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, open, mode === 'edit' ? options.envelope.id : null])

  const cashTotalCents = getEnvelopeCashTotal({
    count100, count50, count20, count10, count5,
  } as Envelope)

  const totalCents = cashTotalCents + coinsAmount + chequeAmount
  const disabled = mode === 'edit' && !!options.disabled
  const hasChanges = mode === 'edit' && (
    count100 !== options.envelope.count100 ||
    count50 !== options.envelope.count50 ||
    count20 !== options.envelope.count20 ||
    count10 !== options.envelope.count10 ||
    count5 !== options.envelope.count5 ||
    coinsAmount !== options.envelope.coinsAmount ||
    chequeAmount !== options.envelope.chequeAmount
  )

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
    if (mode === 'add' && totalCents > 0) {
      setShowDiscardConfirm(true)
      return
    }
    if (mode === 'edit' && hasChanges) {
      setShowDiscardConfirm(true)
      return
    }
    if (mode === 'add') resetFields()
    setAdding(false)
    onClose()
  }

  function handleConfirmDiscard() {
    setShowDiscardConfirm(false)
    if (mode === 'add') resetFields()
    setAdding(false)
    onClose()
  }

  function handleAdd() {
    if (mode !== 'add' || adding) return
    setAdding(true)
    options.onAdd({ count100, count50, count20, count10, count5, coinsAmount, chequeAmount })
    resetFields()
    setAdding(false)
  }

  function handleSave() {
    if (mode !== 'edit') return
    dispatch(updateEnvelope({
      sessionId: options.sessionId,
      envelopeId: options.envelope.id,
      changes: { count100, count50, count20, count10, count5, coinsAmount, chequeAmount },
    }))
    onClose()
  }

  return {
    counts: { count100, count50, count20, count10, count5 },
    setters: { setCount100, setCount50, setCount20, setCount10, setCount5 },
    coinsAmount, setCoinsAmount,
    chequeAmount, setChequeAmount,
    cashTotalCents, totalCents,
    disabled, hasChanges, adding,
    showDiscardConfirm, setShowDiscardConfirm,
    handleClose, handleConfirmDiscard, handleAdd, handleSave,
  }
}
