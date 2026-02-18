import { useState, useRef, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store'
import {
  addEnvelope,
  deleteEnvelope,
  markReportPrinted,
  markDeposited,
  markNoDonations,
  reactivateSession,
  getEnvelopeTotal,
  getEnvelopeCashTotal,
} from '../store/sessionsSlice'
import { formatDate, getCurrentSunday } from '../utils/date'
import { formatCurrency } from '../utils/currency'
import TotalsSummary from './TotalsSummary'
import AddEnvelopeModal from './AddEnvelopeModal'
import ConfirmDialog from './ConfirmDialog'
import StatusConfirmModal from './StatusConfirmModal'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  report_printed: {
    label: 'Report Printed',
    className: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
  },
  deposited: {
    label: 'Deposited',
    className: 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
  },
  no_donations: {
    label: 'No Donations',
    className: 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  },
}

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
  const [envelopeToDelete, setEnvelopeToDelete] = useState<{ id: string; number: number; total: number } | null>(null)
  const [showReportPrintedModal, setShowReportPrintedModal] = useState(false)
  const [showDepositedModal, setShowDepositedModal] = useState(false)
  const [showNoDonationsConfirm, setShowNoDonationsConfirm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMenu) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMenu])

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

  const status = session.status
  const editable = status === 'active'
  const badge = STATUS_BADGE[status]
  const canReactivate = status === 'no_donations' && session.date === getCurrentSunday()
  const sortedEnvelopes = [...session.envelopes].sort((a, b) => a.number - b.number)

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
    const total = getEnvelopeTotal(session!.envelopes.find((e) => e.id === envelope.id)!)
    setEnvelopeToDelete({ id: envelope.id, number: envelope.number, total })
  }

  function handleConfirmDelete() {
    if (envelopeToDelete) {
      dispatch(deleteEnvelope({ sessionId: session!.id, envelopeId: envelopeToDelete.id }))
      setEnvelopeToDelete(null)
    }
  }

  function handleMarkReportPrinted() {
    dispatch(markReportPrinted(session!.id))
    setShowReportPrintedModal(false)
  }

  function handleMarkDeposited(name1: string, name2: string) {
    dispatch(markDeposited({ sessionId: session!.id, name1, name2 }))
    setShowDepositedModal(false)
  }

  function handleMarkNoDonations() {
    dispatch(markNoDonations(session!.id))
    setShowNoDonationsConfirm(false)
  }

  function handleReactivate() {
    dispatch(reactivateSession(session!.id))
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
            {badge && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.className}`}>
                {badge.label}
              </span>
            )}
            {isPanel && editable && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Add Envelope
              </button>
            )}
            {(status === 'active' || status === 'report_printed' || canReactivate) && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30">
                    {status === 'active' && (
                      <>
                        <button
                          onClick={() => { setShowMenu(false); setShowReportPrintedModal(true) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          Mark Report Printed
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); setShowNoDonationsConfirm(true) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          No Donations
                        </button>
                      </>
                    )}
                    {status === 'report_printed' && (
                      <button
                        onClick={() => { setShowMenu(false); setShowDepositedModal(true) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-green-700 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        Mark as Deposited
                      </button>
                    )}
                    {canReactivate && (
                      <button
                        onClick={() => { setShowMenu(false); handleReactivate() }}
                        className="w-full text-left px-4 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        Reactivate Session
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Deposit info */}
        {status === 'deposited' && session.depositedBy && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 space-y-0.5">
            <div>Deposited by <span className="font-medium">{session.depositedBy[0]}</span> and <span className="font-medium">{session.depositedBy[1]}</span></div>
            {session.depositedAt && (
              <div>{new Date(session.depositedAt).toLocaleString()}</div>
            )}
          </div>
        )}

        {/* Report printed info */}
        {status === 'report_printed' && session.reportPrintedAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
            Report printed {new Date(session.reportPrintedAt).toLocaleString()}
          </div>
        )}

        {/* No donations info */}
        {status === 'no_donations' && session.noDonationsAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
            Marked as no donations {new Date(session.noDonationsAt).toLocaleString()}
          </div>
        )}

        {/* Totals Summary */}
        <TotalsSummary session={session} />

        {/* Envelopes */}
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 mt-10!">Envelopes</h3>
        {sortedEnvelopes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
            No envelopes yet.
          </div>
        ) : isPanel ? (
          <div className="grid grid-cols-5 gap-2">
            {sortedEnvelopes.map((envelope) => {
              const cashTotal = getEnvelopeCashTotal(envelope)
              return (
                <div
                  key={envelope.id}
                  className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-black/2 dark:hover:bg-white/2 group"
                >
                  <button
                    onClick={() => onSelectEnvelope(envelope.id)}
                    className="w-full text-left p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">#{envelope.number}</span>
                      {editable && (
                        <div className="w-5" />
                      )}
                    </div>
                    <span className="text-sm font-bold font-mono text-center block mt-1 mb-2">
                      {formatCurrency(getEnvelopeTotal(envelope))}
                    </span>
                    <div className="space-y-0.5 text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                      <div className="flex justify-between">
                        <span>Cash</span>
                        <span>{formatCurrency(cashTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coins</span>
                        <span>{formatCurrency(envelope.coinsAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cheque</span>
                        <span>{formatCurrency(envelope.chequeAmount)}</span>
                      </div>
                    </div>
                  </button>
                  {editable && (
                    <button
                      onClick={() => handleDeleteClick(envelope)}
                      className="absolute top-1.5 right-1.5 p-1 rounded text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {sortedEnvelopes.map((envelope) => {
              const cashTotal = getEnvelopeCashTotal(envelope)
              return (
                <div
                  key={envelope.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center"
                >
                  <button
                    onClick={() => onSelectEnvelope(envelope.id)}
                    className="flex-1 text-left px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2 rounded-l-lg"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Envelope #{envelope.number}</span>
                      <span className="text-sm font-bold font-mono">
                        {formatCurrency(getEnvelopeTotal(envelope))}
                      </span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                      <span>Cash {formatCurrency(cashTotal)}</span>
                      <span>Coins {formatCurrency(envelope.coinsAmount)}</span>
                      <span>Cheque {formatCurrency(envelope.chequeAmount)}</span>
                    </div>
                  </button>
                  {editable && (
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
              )
            })}
          </div>
        )}
        <div className="h-40" />
      </div>

      {/* Bottom action bar (mobile) */}
      {!isPanel && editable && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowAddModal(true)}
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

      {/* Status Confirmation Modals */}
      <StatusConfirmModal
        type="report_printed"
        open={showReportPrintedModal}
        onConfirm={handleMarkReportPrinted}
        onCancel={() => setShowReportPrintedModal(false)}
      />
      <StatusConfirmModal
        type="deposited"
        open={showDepositedModal}
        onConfirm={handleMarkDeposited}
        onCancel={() => setShowDepositedModal(false)}
      />

      {/* No Donations Confirmation */}
      <ConfirmDialog
        open={showNoDonationsConfirm}
        title="Mark as No Donations?"
        message={
          session.envelopes.length > 0
            ? `You have ${session.envelopes.length} envelope${session.envelopes.length > 1 ? 's' : ''} recorded for this Sunday. Marking it as "No Donations" will wipe all of them permanently. You can reactivate this session later, but the envelope data will be gone for good.`
            : 'This will mark the session as having no donations received this Sunday. You can always reactivate it later if needed.'
        }
        confirmLabel="Yes, No Donations"
        onConfirm={handleMarkNoDonations}
        onCancel={() => setShowNoDonationsConfirm(false)}
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
