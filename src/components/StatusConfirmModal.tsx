import { useState } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { useModalKeys } from '../hooks/useModalKeys'
import { SPRING_MODAL } from '../utils/constants'

interface ReportPrintedProps {
  type: 'report_printed'
  open: boolean
  onConfirm: (batchNumber: string) => void
  onCancel: () => void
}

interface DepositedProps {
  type: 'deposited'
  open: boolean
  onConfirm: (name1: string, name2: string) => void
  onCancel: () => void
}

interface NoDonationsProps {
  type: 'no_donations'
  open: boolean
  envelopeCount: number
  onConfirm: (reason: string) => void
  onCancel: () => void
}

type Props = ReportPrintedProps | DepositedProps | NoDonationsProps

export default function StatusConfirmModal(props: Props) {
  const { type, open, onCancel } = props
  const [batchNumber, setBatchNumber] = useState('')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [reason, setReason] = useState('')

  useModalKeys(open, { onClose: onCancel, onConfirm: handleConfirm })

  const transitions = useTransition(open, {
    from: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    enter: { backdropOpacity: 1, scale: 1, dialogOpacity: 1 },
    leave: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    config: SPRING_MODAL,
    onDestroyed: () => {
      setBatchNumber('')
      setName1('')
      setName2('')
      setReason('')
    },
  })

  function handleConfirm() {
    if (type === 'report_printed') {
      if (!batchNumber.trim()) return
      props.onConfirm(batchNumber.trim())
    } else if (type === 'deposited') {
      if (!name1.trim() || !name2.trim()) return
      props.onConfirm(name1.trim(), name2.trim())
    } else if (type === 'no_donations') {
      if (!reason.trim()) return
      props.onConfirm(reason.trim())
    }
  }

  const canConfirm =
    type === 'report_printed'
      ? batchNumber.trim()
      : type === 'deposited'
        ? name1.trim() && name2.trim()
        : type === 'no_donations'
          ? reason.trim()
          : true

  const title =
    type === 'deposited'
      ? 'Mark as Deposited?'
      : type === 'no_donations'
        ? 'Mark as No Donations?'
        : 'Mark Report as Printed?'

  const description =
    type === 'deposited'
      ? 'Record the deposit details. This action cannot be undone.'
      : type === 'no_donations'
        ? props.type === 'no_donations' && props.envelopeCount > 0
          ? `You have ${props.envelopeCount} envelope${props.envelopeCount > 1 ? 's' : ''} recorded for this Sunday. Marking it as "No Donations" will permanently delete all envelope data. Please provide a reason.`
          : 'This will mark the session as having no donations received. You can reactivate it later, but please provide a reason.'
        : 'This will mark the report as printed and recorded in the church system. Envelopes can no longer be modified. This action cannot be undone.'

  return transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <animated.div
          className="fixed inset-0 bg-black/40"
          style={{ opacity: styles.backdropOpacity }}
          onClick={onCancel}
        />
        <animated.div
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6"
          style={{
            opacity: styles.dialogOpacity,
            transform: styles.scale.to((s) => `scale(${s})`),
          }}
        >
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>

          {type === 'report_printed' && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Batch Number
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. 81014103"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          {type === 'deposited' && (
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Depositor 1
                </label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Depositor 2
                </label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {type === 'no_donations' && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Ward conference, stake event, no meeting held..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                autoFocus
              />
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {type === 'no_donations' ? 'Yes, No Donations' : 'Confirm'}
            </button>
          </div>
        </animated.div>
      </div>
    ) : null
  )
}
