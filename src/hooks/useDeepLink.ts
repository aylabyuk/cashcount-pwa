import { useEffect } from 'react'
import { useAppDispatch } from '../store'
import { navigateToDetail } from '../store/viewSlice'

/**
 * Handle deep links from push notifications.
 * When the app is opened via a notification click (e.g. /session/abc123),
 * this hook navigates to the correct session detail view.
 */
export function useDeepLink() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/^\/session\/([^/]+)$/)
    if (match) {
      dispatch(navigateToDetail(match[1]))
      // Clean up the URL so the deep link doesn't re-trigger on refresh
      window.history.replaceState(null, '', '/')
    }
  }, [dispatch])
}
