import { useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'
import { SPRING_SNAPPY } from '../utils/constants'

interface Props {
  open: boolean
  message: string
  duration?: number
  onClose: () => void
}

export default function Toast({ open, message, duration = 4000, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [open, duration, onClose])

  const transitions = useTransition(open, {
    from: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 20 },
    config: SPRING_SNAPPY,
  })

  return transitions((styles, show) =>
    show ? (
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <animated.div
          className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg pointer-events-auto"
          style={{
            opacity: styles.opacity,
            transform: styles.y.to((y) => `translateY(${y}px)`),
          }}
        >
          {message}
        </animated.div>
      </div>
    ) : null
  )
}
