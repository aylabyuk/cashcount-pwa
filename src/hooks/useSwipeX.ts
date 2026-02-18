import { useRef, useCallback } from 'react'

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function useSwipeX(options: Omit<UseSwipeOptions, 'onSwipeUp' | 'onSwipeDown'>) {
  return useSwipe(options)
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseSwipeOptions) {
  const startX = useRef(0)
  const startY = useRef(0)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - startX.current
    const deltaY = e.changedTouches[0].clientY - startY.current

    // Determine dominant axis
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) < threshold) return
      if (deltaX < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    } else {
      if (Math.abs(deltaY) < threshold) return
      if (deltaY < 0) onSwipeUp?.()
      else onSwipeDown?.()
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  return { onTouchStart, onTouchEnd }
}
