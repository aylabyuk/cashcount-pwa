import { formatDate } from '../../utils/date'
import TotalsSummary from '../TotalsSummary'
import SessionDetailHeader from './SessionDetailHeader'
import NoDonationsView from './NoDonationsView'
import EnvelopeCards from './EnvelopeCards'
import SessionDetailModals from './SessionDetailModals'
import { useSessionDetail } from './useSessionDetail'
import { useSessionActions } from './useSessionActions'

interface Props {
  sessionId: string
  onNotFound: () => void
  isPanel?: boolean
}

export default function SessionDetailContent({
  sessionId,
  onNotFound,
  isPanel,
}: Props) {
  const { session, status, editable, badge, canReactivate, sortedEnvelopes, displayIndex } = useSessionDetail(sessionId)
  const actions = useSessionActions(session, displayIndex)

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

  return (
    <div className={isPanel ? 'h-full overflow-y-auto no-scrollbar' : ''}>
      <div className={`${isPanel ? 'p-4 space-y-4' : 'p-4 pb-0 space-y-4'} ${status === 'no_donations' ? `flex flex-col ${isPanel ? 'h-full' : 'min-h-[calc(100vh-3.5rem)]'}` : ''}`}>
        <SessionDetailHeader
          date={formatDate(session.date)}
          envelopeCount={session.envelopes.length}
          badge={badge}
          editable={editable}
          isPanel={!!isPanel}
          status={status}
          canReactivate={canReactivate}
          onAdd={() => actions.setShowAddModal(true)}
          onMarkReportPrinted={() => actions.setShowReportPrintedModal(true)}
          onMarkDeposited={() => actions.setShowDepositedModal(true)}
          onMarkNoDonations={() => actions.setShowNoDonationsConfirm(true)}
          onReactivate={actions.handleReactivate}
        />

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
        {(status === 'report_printed' || status === 'deposited') && session.reportPrintedAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 space-y-0.5">
            <div className="font-medium">Report printed{session.batchNumber && <span> — Batch #{session.batchNumber}</span>}</div>
            <div>{new Date(session.reportPrintedAt).toLocaleString()}</div>
          </div>
        )}

        {/* No donations view */}
        {status === 'no_donations' ? (
          <NoDonationsView
            reason={session.noDonationsReason}
            recordedAt={session.noDonationsAt}
            canReactivate={canReactivate}
            onReactivate={actions.handleReactivate}
          />
        ) : (
          <>
            <TotalsSummary session={session} />
            <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 mt-10!">Envelopes</h3>
            <EnvelopeCards
              sortedEnvelopes={sortedEnvelopes}
              displayIndex={displayIndex}
              editable={editable}
              isPanel={!!isPanel}
              onEdit={(id) => actions.setEditingEnvelopeId(id)}
              onDelete={actions.handleDeleteClick}
              onAdd={() => actions.setShowAddModal(true)}
            />
          </>
        )}
        {!isPanel && <div className="h-40" />}
      </div>

      {/* Bottom action bar (mobile) */}
      {!isPanel && editable && (
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => actions.setShowAddModal(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Add Envelope
            </button>
          </div>
        </div>
      )}

      <SessionDetailModals
        sessionId={session.id}
        editable={editable}
        envelopeCount={session.envelopes.length}
        displayIndex={displayIndex}
        showAddModal={actions.showAddModal}
        onCloseAddModal={() => actions.setShowAddModal(false)}
        onAdd={actions.handleAddEnvelope}
        editingEnvelopeId={actions.editingEnvelopeId}
        editingEnvelope={actions.editingEnvelope}
        onCloseEditModal={() => actions.setEditingEnvelopeId(null)}
        showReportPrintedModal={actions.showReportPrintedModal}
        onCancelReportPrinted={() => actions.setShowReportPrintedModal(false)}
        onConfirmReportPrinted={actions.handleMarkReportPrinted}
        showDepositedModal={actions.showDepositedModal}
        onCancelDeposited={() => actions.setShowDepositedModal(false)}
        onConfirmDeposited={actions.handleMarkDeposited}
        showNoDonationsConfirm={actions.showNoDonationsConfirm}
        onCancelNoDonations={() => actions.setShowNoDonationsConfirm(false)}
        onConfirmNoDonations={actions.handleMarkNoDonations}
        envelopeToDelete={actions.envelopeToDelete}
        onCancelDelete={() => actions.setEnvelopeToDelete(null)}
        onConfirmDelete={actions.handleConfirmDelete}
      />
    </div>
  )
}
