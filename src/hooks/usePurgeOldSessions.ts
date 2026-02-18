import { useEffect, useState, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { purgeOldSessions } from '../store/sessionsSlice'
import { PURGE_MONTHS } from '../utils/constants'

export function usePurgeOldSessions() {
  const sessions = useAppSelector((s) => s.sessions.sessions)
  const dispatch = useAppDispatch()
  const [toastMessage, setToastMessage] = useState('')
  const handleToastClose = useCallback(() => setToastMessage(''), [])

  useEffect(() => {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - PURGE_MONTHS)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    const oldCount = sessions.filter((s) => s.date < cutoffStr).length
    if (oldCount > 0) {
      dispatch(purgeOldSessions())
      setToastMessage(
        `${oldCount} session${oldCount > 1 ? 's' : ''} older than ${PURGE_MONTHS} months removed`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { toastMessage, handleToastClose }
}
