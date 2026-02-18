import { useTransition, animated } from '@react-spring/web'
import { useModalKeys } from '../hooks/useModalKeys'
import { MODAL_TRANSITION } from '../utils/constants'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  useModalKeys(open, { onClose: onCancel, onConfirm })

  const transitions = useTransition(open, MODAL_TRANSITION)

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
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {confirmLabel}
            </button>
          </div>
        </animated.div>
      </div>
    ) : null
  )
}
