import { useTransition, animated } from '@react-spring/web'
import { useModalKeys } from '../../hooks/useModalKeys'
import { SPRING_MODAL } from '../../utils/constants'
import StatusFormFields from './StatusFormFields'
import { useStatusConfirmForm } from './useStatusConfirmForm'

interface RecordedProps {
  type: 'recorded'
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

type Props = RecordedProps | DepositedProps | NoDonationsProps

export default function StatusConfirmModal(props: Props) {
  const { type, open, onCancel } = props

  const form = useStatusConfirmForm({
    type,
    envelopeCount: type === 'no_donations' ? props.envelopeCount : undefined,
    onConfirmRecorded: type === 'recorded' ? props.onConfirm : undefined,
    onConfirmDeposited: type === 'deposited' ? props.onConfirm : undefined,
    onConfirmNoDonations: type === 'no_donations' ? props.onConfirm : undefined,
  })

  useModalKeys(open, { onClose: onCancel, onConfirm: form.handleConfirm })

  const transitions = useTransition(open, {
    from: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    enter: { backdropOpacity: 1, scale: 1, dialogOpacity: 1 },
    leave: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    config: SPRING_MODAL,
    onDestroyed: form.resetFields,
  })

  const formFields =
    type === 'recorded' ? (
      <StatusFormFields type="recorded" batchNumber={form.batchNumber} onBatchNumberChange={form.setBatchNumber} />
    ) : type === 'deposited' ? (
      <StatusFormFields type="deposited" name1={form.name1} name2={form.name2} onName1Change={form.setName1} onName2Change={form.setName2} />
    ) : (
      <StatusFormFields type="no_donations" reason={form.reason} onReasonChange={form.setReason} />
    )

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
          <h2 className="text-lg font-semibold mb-2">{form.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{form.description}</p>
          {formFields}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={form.handleConfirm}
              disabled={!form.canConfirm}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {form.confirmLabel}
            </button>
          </div>
        </animated.div>
      </div>
    ) : null
  )
}
