import { useEffect } from 'react'

export function useModalKeys(
  open: boolean,
  handlers: { onClose: () => void; onConfirm?: () => void }
) {
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
