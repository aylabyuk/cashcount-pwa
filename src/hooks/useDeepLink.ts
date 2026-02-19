import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { navigateToDetail } from '../store/viewSlice'

/**
 * Handle deep links from push notifications.
 *
 * Two paths:
 * 1. URL-based: app opened via notification click when closed (e.g. /session/abc123)
 * 2. postMessage: app already open, SW sends message to navigate
 */
export function useDeepLink() {
  const dispatch = useAppDispatch()

  // Handle URL-based deep link on mount (app was closed)
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/^\/session\/([^/]+)$/)
    if (match) {
      dispatch(navigateToDetail(match[1]))
      window.history.replaceState(null, '', '/')
    }
  }, [dispatch])

  // Listen for postMessage from service worker (app was already open)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'NAVIGATE_TO_SESSION' && event.data.sessionId) {
        dispatch(navigateToDetail(event.data.sessionId))
      }
    }

    navigator.serviceWorker?.addEventListener('message', handleMessage)
    return () => navigator.serviceWorker?.removeEventListener('message', handleMessage)
  }, [dispatch])
}
