import { useState, useCallback } from 'react'
import { useAppSelector } from '../../store'

type Type = 'recorded' | 'deposited' | 'no_donations'

interface Options {
  type: Type
  envelopeCount?: number
  onConfirmRecorded?: (batchNumber: string) => void
  onConfirmDeposited?: (name1: string, name2: string) => void
  onConfirmNoDonations?: (reason: string) => void
}

export function useStatusConfirmForm(options: Options) {
  const { type } = options
  const userName = useAppSelector((s) => s.auth.user?.displayName ?? '')
  const [batchNumber, setBatchNumber] = useState('')
  const [name1, setName1] = useState(type === 'deposited' ? userName : '')
  const [name2, setName2] = useState('')
  const [reason, setReason] = useState('')

  const resetFields = useCallback(() => {
    setBatchNumber('')
    setName1(userName)
    setName2('')
    setReason('')
  }, [userName])

  const handleConfirm = useCallback(() => {
    if (type === 'recorded') {
      if (!batchNumber.trim()) return
      options.onConfirmRecorded?.(batchNumber.trim())
    } else if (type === 'deposited') {
      if (!name1.trim() || !name2.trim()) return
      options.onConfirmDeposited?.(name1.trim(), name2.trim())
    } else if (type === 'no_donations') {
      if (!reason.trim()) return
      options.onConfirmNoDonations?.(reason.trim())
    }
  }, [type, batchNumber, name1, name2, reason, options])

  const canConfirm =
    type === 'recorded'
      ? !!batchNumber.trim()
      : type === 'deposited'
        ? !!(name1.trim() && name2.trim())
        : !!reason.trim()

  const title =
    type === 'deposited'
      ? 'Mark as Deposited?'
      : type === 'no_donations'
        ? 'Mark as No Donations?'
        : 'Mark Session as Recorded?'

  const envelopeCount = options.envelopeCount ?? 0
  const description =
    type === 'deposited'
      ? 'Record the deposit details. This action cannot be undone.'
      : type === 'no_donations'
        ? envelopeCount > 0
          ? `You have ${envelopeCount} envelope${envelopeCount > 1 ? 's' : ''} recorded for this Sunday. Marking it as "No Donations" will permanently delete all envelope data. Please provide a reason.`
          : 'This will mark the session as having no donations received. You can reactivate it later, but please provide a reason.'
        : 'This will mark the session as recorded in the church system. Envelopes can no longer be modified. This action cannot be undone.'

  const confirmLabel = type === 'no_donations' ? 'Yes, No Donations' : 'Confirm'

  return {
    batchNumber, setBatchNumber,
    name1, setName1,
    name2, setName2,
    reason, setReason,
    resetFields,
    handleConfirm,
    canConfirm,
    title,
    description,
    confirmLabel,
  }
}
