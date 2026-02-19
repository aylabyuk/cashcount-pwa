import { useState, useCallback } from 'react'
import { useAppSelector } from '../../store'

type Type = 'recorded' | 'deposited' | 'no_donations'

interface Options {
  type: Type
  envelopeCount?: number
  onConfirmRecorded?: (batchNumber: string) => void
  onConfirmDeposited?: (depositor1Email: string, depositor2Email: string) => void
  onConfirmNoDonations?: (reason: string) => void
}

export function useStatusConfirmForm(options: Options) {
  const { type } = options
  const userEmail = useAppSelector((s) => s.auth.user?.email ?? '')
  const [batchNumber, setBatchNumber] = useState('')
  const [depositor1Email, setDepositor1Email] = useState(type === 'deposited' ? userEmail : '')
  const [depositor2Email, setDepositor2Email] = useState('')
  const [reason, setReason] = useState('')

  const resetFields = useCallback(() => {
    setBatchNumber('')
    setDepositor1Email(userEmail)
    setDepositor2Email('')
    setReason('')
  }, [userEmail])

  const handleConfirm = useCallback(() => {
    if (type === 'recorded') {
      if (!batchNumber.trim()) return
      options.onConfirmRecorded?.(batchNumber.trim())
    } else if (type === 'deposited') {
      if (!depositor1Email || !depositor2Email) return
      if (depositor1Email === depositor2Email) return
      options.onConfirmDeposited?.(depositor1Email, depositor2Email)
    } else if (type === 'no_donations') {
      if (!reason.trim()) return
      options.onConfirmNoDonations?.(reason.trim())
    }
  }, [type, batchNumber, depositor1Email, depositor2Email, reason, options])

  const canConfirm =
    type === 'recorded'
      ? !!batchNumber.trim()
      : type === 'deposited'
        ? !!(depositor1Email && depositor2Email && depositor1Email !== depositor2Email)
        : !!reason.trim()

  const title =
    type === 'deposited'
      ? 'Initiate Deposit'
      : type === 'no_donations'
        ? 'Mark as No Donations?'
        : 'Mark Session as Recorded?'

  const envelopeCount = options.envelopeCount ?? 0
  const description =
    type === 'deposited'
      ? 'Select the two members who will deposit the funds. After you initiate, the second depositor must log in to verify.'
      : type === 'no_donations'
        ? envelopeCount > 0
          ? `You have ${envelopeCount} envelope${envelopeCount > 1 ? 's' : ''} recorded for this Sunday. Marking it as "No Donations" will permanently delete all envelope data. Please provide a reason.`
          : 'This will mark the session as having no donations received. You can reactivate it later, but please provide a reason.'
        : 'This will mark the session as recorded in the church system. Envelopes can no longer be modified. This action cannot be undone.'

  const confirmLabel =
    type === 'deposited'
      ? 'Initiate Deposit'
      : type === 'no_donations'
        ? 'Yes, No Donations'
        : 'Confirm'

  return {
    batchNumber, setBatchNumber,
    depositor1Email, setDepositor1Email,
    depositor2Email, setDepositor2Email,
    reason, setReason,
    resetFields,
    handleConfirm,
    canConfirm,
    title,
    description,
    confirmLabel,
  }
}
