import { useEffect } from 'react'

export function useModalKeys(
  open: boolean,
  handlers: { onClose: () => void; onConfirm?: () => void }
) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handlers.onClose()
      if (e.key === 'Enter') (handlers.onConfirm ?? handlers.onClose)()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  })
}
