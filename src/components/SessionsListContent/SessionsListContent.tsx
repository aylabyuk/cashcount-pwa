import { formatDate, getCurrentSunday } from '../../utils/date'
import ConfirmDialog from '../ConfirmDialog'
import AlertDialog from '../AlertDialog'
import SessionListItem from './SessionListItem'
import { useSessionsList } from './useSessionsList'

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
  const list = useSessionsList(selectedSessionId, onSessionDeleted)

  return (
    <div className={isPanel ? 'flex flex-col flex-1 min-h-0' : ''}>
      <div className={isPanel ? 'flex-1 overflow-y-auto no-scrollbar p-4' : 'p-4 pb-20'}>
        {isPanel && (
          <button
            onClick={list.handleAddSession}
            className="w-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-3"
          >
            New Session
          </button>
        )}
        {list.sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium mb-1">No Sessions</p>
            <p className="text-sm">Start a new counting session below.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.sessions.slice(0, list.visibleCount).map((session) => (
              <SessionListItem
                key={session.id}
                session={session}
                isSelected={session.id === selectedSessionId}
                onSelect={onSelectSession}
              />
            ))}
            {list.visibleCount < list.sessions.length && (
              <button
                onClick={list.loadMore}
                className="w-full py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Load More
              </button>
            )}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-3">
              Sessions older than 6 months are automatically removed.
            </p>
          </div>
        )}
      </div>

      {!isPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={list.handleAddSession}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              New Session
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={list.sessionToDelete !== null}
        title="Delete Session?"
        message={
          list.deleteTarget
            ? `This will permanently delete the session from ${formatDate(list.deleteTarget.date)} with ${list.deleteTarget.envelopes.length} envelope(s). This cannot be undone.`
            : ''
        }
        onConfirm={list.handleConfirmDelete}
        onCancel={() => list.setSessionToDelete(null)}
      />

      <AlertDialog
        open={list.showDuplicateAlert}
        title="Session Already Exists"
        message={`A session for this Sunday (${formatDate(getCurrentSunday())}) already exists.`}
        onClose={() => list.setShowDuplicateAlert(false)}
      />
    </div>
  )
}
