import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { addSession, deleteSession, getSessionTotals } from '../store/sessionsSlice'
import { formatDate, isSessionLocked, getCurrentSunday } from '../utils/date'
import { formatCurrency } from '../utils/currency'
import ConfirmDialog from './ConfirmDialog'

interface Props {
  onSelectSession: (id: string) => void
  onSessionDeleted?: (deletedId: string) => void
  selectedSessionId?: string | null
  isPanel?: boolean
}

export default function SessionsListContent({
  onSelectSession,
  onSessionDeleted,
  selectedSessionId,
  isPanel,
}: Props) {
  const sessions = useAppSelector((s) => s.sessions.sessions)
  const dispatch = useAppDispatch()

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false)

  function handleAddSession() {
    const sunday = getCurrentSunday()
    const exists = sessions.some((s) => s.date === sunday)
    if (exists) {
      setShowDuplicateAlert(true)
    } else {
      dispatch(addSession({ date: sunday }))
    }
  }

  function handleConfirmDelete() {
    if (sessionToDelete) {
      dispatch(deleteSession(sessionToDelete))
      if (sessionToDelete === selectedSessionId) {
        onSessionDeleted?.(sessionToDelete)
      }
      setSessionToDelete(null)
    }
  }

  const deleteTarget = sessions.find((s) => s.id === sessionToDelete)

  return (
    <div className={isPanel ? 'flex flex-col h-full' : ''}>
      <div className={isPanel ? 'flex-1 overflow-y-auto p-4' : 'p-4 pb-20'}>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium mb-1">No Sessions</p>
            <p className="text-sm">Start a new counting session below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => {
              const totals = getSessionTotals(session)
              const locked = isSessionLocked(session.date)
              const isSelected = session.id === selectedSessionId
              return (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left rounded-lg border px-4 py-3 ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-black/2 dark:hover:bg-white/2 active:bg-black/4 dark:active:bg-white/4'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{formatDate(session.date)}</span>
                        {locked && (
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.envelopes.length} envelope(s)
                      </span>
                    </div>
                    <span className="text-lg font-semibold font-mono">
                      {formatCurrency(totals.grandTotal)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
        {isPanel && (
          <button
            onClick={handleAddSession}
            className="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-3"
          >
            New Session
          </button>
        )}
      </div>

      {!isPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleAddSession}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              New Session
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={sessionToDelete !== null}
        title="Delete Session?"
        message={
          deleteTarget
            ? `This will permanently delete the session from ${formatDate(deleteTarget.date)} with ${deleteTarget.envelopes.length} envelope(s). This cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setSessionToDelete(null)}
      />

      {/* Duplicate alert */}
      {showDuplicateAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowDuplicateAlert(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-2">Session Already Exists</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A session for this Sunday ({formatDate(getCurrentSunday())}) already exists.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDuplicateAlert(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
