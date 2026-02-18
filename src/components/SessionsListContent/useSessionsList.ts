import { useState, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '../../store'
import { addSession, deleteSession } from '../../store/sessionsSlice'
import { getCurrentSunday } from '../../utils/date'

export function useSessionsList(
  selectedSessionId: string | null | undefined,
  onSessionDeleted?: (deletedId: string) => void,
) {
  const sessions = useAppSelector((s) =>
    [...s.sessions.sessions].sort((a, b) => b.date.localeCompare(a.date))
  )
  const dispatch = useAppDispatch()

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)

  const handleAddSession = useCallback(() => {
    const sunday = getCurrentSunday()
    const exists = sessions.some((s) => s.date === sunday)
    if (exists) {
      setShowDuplicateAlert(true)
    } else {
      dispatch(addSession({ date: sunday }))
    }
  }, [sessions, dispatch])

  const handleConfirmDelete = useCallback(() => {
    if (sessionToDelete) {
      dispatch(deleteSession(sessionToDelete))
      if (sessionToDelete === selectedSessionId) {
        onSessionDeleted?.(sessionToDelete)
      }
      setSessionToDelete(null)
    }
  }, [dispatch, sessionToDelete, selectedSessionId, onSessionDeleted])

  const loadMore = useCallback(() => setVisibleCount((c) => c + 5), [])

  const deleteTarget = sessions.find((s) => s.id === sessionToDelete)

  return {
    sessions,
    visibleCount,
    sessionToDelete,
    setSessionToDelete,
    showDuplicateAlert,
    setShowDuplicateAlert,
    deleteTarget,
    handleAddSession,
    handleConfirmDelete,
    loadMore,
  }
}
