import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import { addEnvelope, deleteEnvelope, getEnvelopeTotal } from '../store/sessionsSlice'
import { formatDate, isSessionLocked } from '../utils/date'
import { formatCurrency } from '../utils/currency'
import TotalsSummary from './TotalsSummary'
import AddEnvelopeModal from './AddEnvelopeModal'
import ConfirmDialog from './ConfirmDialog'
import AlertDialog from './AlertDialog'

interface Props {
  sessionId: string
  onSelectEnvelope: (envelopeId: string) => void
  onNotFound: () => void
  isPanel?: boolean
}

export default function SessionDetailContent({
  sessionId,
  onSelectEnvelope,
  onNotFound,
  isPanel,
}: Props) {
  const dispatch = useAppDispatch()
  const session = useAppSelector((s) => s.sessions.sessions.find((s) => s.id === sessionId))

  const [showAddModal, setShowAddModal] = useState(false)
  const [showLockedAlert, setShowLockedAlert] = useState(false)
  const [envelopeToDelete, setEnvelopeToDelete] = useState<{ id: string; number: number; total: number } | null>(null)

  if (!session) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <p>Session not found.</p>
        <button onClick={onNotFound} className="mt-2 text-blue-600 dark:text-blue-400">
          Go back
        </button>
      </div>
    )
  }

  const locked = isSessionLocked(session.date)
  const sortedEnvelopes = [...session.envelopes].sort((a, b) => a.number - b.number)

  function handleAddClick() {
    if (locked) {
      setShowLockedAlert(true)
    } else {
      setShowAddModal(true)
    }
  }

  function handleAddEnvelope(envelope: {
    count100: number
    count50: number
    count20: number
    count10: number
    count5: number
    coinsAmount: number
    chequeAmount: number
  }) {
    dispatch(addEnvelope({ sessionId: session!.id, envelope }))
    setShowAddModal(false)
  }

  function handleDeleteClick(envelope: { id: string; number: number }) {
    if (locked) {
      setShowLockedAlert(true)
      return
    }
    const total = getEnvelopeTotal(session!.envelopes.find((e) => e.id === envelope.id)!)
    setEnvelopeToDelete({ id: envelope.id, number: envelope.number, total })
  }

  function handleConfirmDelete() {
    if (envelopeToDelete) {
      dispatch(deleteEnvelope({ sessionId: session!.id, envelopeId: envelopeToDelete.id }))
      setEnvelopeToDelete(null)
    }
  }

  return (
    <div className={isPanel ? 'h-full overflow-y-auto' : ''}>
      <div className={isPanel ? 'p-4 space-y-4' : 'p-4 pb-0 space-y-4'}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {formatDate(session.date)} ({session.envelopes.length})
          </h2>
          <div className="flex items-center gap-2">
            {locked && (
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Locked
              </span>
            )}
            {isPanel && !locked && (
              <button
                onClick={handleAddClick}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Add Envelope
              </button>
            )}
          </div>
        </div>

        {/* Totals Summary */}
        <TotalsSummary session={session} />

        {/* Envelopes */}
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 mt-10!">Envelopes</h3>
        {sortedEnvelopes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            No envelopes yet.
          </div>
        ) : (
          <div className="space-y-1">
            {sortedEnvelopes.map((envelope) => (
              <div
                key={envelope.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center"
              >
                <button
                  onClick={() => onSelectEnvelope(envelope.id)}
                  className="flex-1 text-left px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 rounded-l-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Envelope #{envelope.number}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {formatCurrency(getEnvelopeTotal(envelope))}
                    </span>
                  </div>
                </button>
                {!locked && (
                  <button
                    onClick={() => handleDeleteClick(envelope)}
                    className="px-3 py-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 border-l border-gray-200 dark:border-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="h-40" />
      </div>

      {!isPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleAddClick}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Add Envelope
            </button>
          </div>
        </div>
      )}

      {/* Add Envelope Modal */}
      <AddEnvelopeModal
        open={showAddModal}
        onAdd={handleAddEnvelope}
        onCancel={() => setShowAddModal(false)}
      />

      {/* Locked Alert */}
      <AlertDialog
        open={showLockedAlert}
        title="Session Locked"
        message="This session is locked because the week has passed. You can still view the records but cannot add, edit, or delete envelopes."
        onClose={() => setShowLockedAlert(false)}
      />

      {/* Delete Envelope Confirmation */}
      <ConfirmDialog
        open={envelopeToDelete !== null}
        title="Delete Envelope?"
        message={
          envelopeToDelete
            ? `This will permanently delete Envelope #${envelopeToDelete.number} (${formatCurrency(envelopeToDelete.total)}). This cannot be undone.`
            : ''
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setEnvelopeToDelete(null)}
      />
    </div>
  )
}
