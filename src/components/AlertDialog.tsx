import { useTransition, animated } from '@react-spring/web'
import { useModalKeys } from '../hooks/useModalKeys'

interface Props {
  open: boolean
  title: string
  message: string
  buttonLabel?: string
  onClose: () => void
}

export default function AlertDialog({ open, title, message, buttonLabel = 'OK', onClose }: Props) {
  useModalKeys(open, { onClose })

  const transitions = useTransition(open, {
    from: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    enter: { backdropOpacity: 1, scale: 1, dialogOpacity: 1 },
    leave: { backdropOpacity: 0, scale: 0.95, dialogOpacity: 0 },
    config: { tension: 300, friction: 30 },
  })

  return transitions((styles, show) =>
    show ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <animated.div
          className="fixed inset-0 bg-black/40"
          style={{ opacity: styles.backdropOpacity }}
          onClick={onClose}
        />
        <animated.div
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6"
          style={{
            opacity: styles.dialogOpacity,
            transform: styles.scale.to((s) => `scale(${s})`),
          }}
        >
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {buttonLabel}
            </button>
          </div>
        </animated.div>
      </div>
    ) : null
  )
}
