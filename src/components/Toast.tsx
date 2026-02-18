import { useEffect } from 'react'
import { useTransition, animated } from '@react-spring/web'

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
    config: { tension: 300, friction: 24 },
  })

  return transitions((styles, show) =>
    show ? (
      <animated.div
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg"
        style={{
          opacity: styles.opacity,
          transform: styles.y.to((y) => `translateX(-50%) translateY(${y}px)`),
        }}
      >
        {message}
      </animated.div>
    ) : null
  )
}
