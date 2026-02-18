import { useState, useCallback } from 'react'

type Type = 'report_printed' | 'deposited' | 'no_donations'

interface Options {
  type: Type
  envelopeCount?: number
  onConfirmReportPrinted?: (batchNumber: string) => void
  onConfirmDeposited?: (name1: string, name2: string) => void
  onConfirmNoDonations?: (reason: string) => void
}

export function useStatusConfirmForm(options: Options) {
  const { type } = options
  const [batchNumber, setBatchNumber] = useState('')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [reason, setReason] = useState('')

  const resetFields = useCallback(() => {
    setBatchNumber('')
    setName1('')
    setName2('')
    setReason('')
  }, [])

  const handleConfirm = useCallback(() => {
    if (type === 'report_printed') {
      if (!batchNumber.trim()) return
      options.onConfirmReportPrinted?.(batchNumber.trim())
    } else if (type === 'deposited') {
      if (!name1.trim() || !name2.trim()) return
      options.onConfirmDeposited?.(name1.trim(), name2.trim())
    } else if (type === 'no_donations') {
      if (!reason.trim()) return
      options.onConfirmNoDonations?.(reason.trim())
    }
  }, [type, batchNumber, name1, name2, reason, options])

  const canConfirm =
    type === 'report_printed'
      ? !!batchNumber.trim()
      : type === 'deposited'
        ? !!(name1.trim() && name2.trim())
        : !!reason.trim()

  const title =
    type === 'deposited'
      ? 'Mark as Deposited?'
      : type === 'no_donations'
        ? 'Mark as No Donations?'
        : 'Mark Report as Printed?'

  const envelopeCount = options.envelopeCount ?? 0
  const description =
    type === 'deposited'
      ? 'Record the deposit details. This action cannot be undone.'
      : type === 'no_donations'
        ? envelopeCount > 0
          ? `You have ${envelopeCount} envelope${envelopeCount > 1 ? 's' : ''} recorded for this Sunday. Marking it as "No Donations" will permanently delete all envelope data. Please provide a reason.`
          : 'This will mark the session as having no donations received. You can reactivate it later, but please provide a reason.'
        : 'This will mark the report as printed and recorded in the church system. Envelopes can no longer be modified. This action cannot be undone.'

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
