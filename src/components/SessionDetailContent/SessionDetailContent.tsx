import { useMemo } from 'react'
import { formatDate } from '../../utils/date'
import { useAppSelector } from '../../store'
import { useMembers } from '../../hooks/useMembers'
import { resolveDepositorNames } from '../../utils/deposit'
import TotalsSummary from '../TotalsSummary'
import PrintableReport from '../PrintableReport'
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
  const { session, status, editable, badge, canReactivate, canVerify, sortedEnvelopes, displayIndex } = useSessionDetail(sessionId)
  const actions = useSessionActions(session, displayIndex)
  const authUser = useAppSelector((s) => s.auth.user)
  const unitName = useAppSelector((s) => s.auth.unit?.unitName)
  const unitId = useAppSelector((s) => s.auth.unit?.unitId ?? null)
  const { activeMembers } = useMembers(unitId)
  const membersMap = useMemo(
    () => new Map(activeMembers.map((m) => [m.email, m])),
    [activeMembers]
  )

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

  const depositorNames = resolveDepositorNames(session, membersMap)

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
          onPrint={() => window.print()}
          onMarkRecorded={() => actions.setShowRecordedModal(true)}
          onInitiateDeposit={() => actions.setShowDepositedModal(true)}
          onMarkNoDonations={() => actions.setShowNoDonationsConfirm(true)}
          onReactivate={actions.handleReactivate}
        />

        {/* Pending deposit info */}
        {status === 'pending_deposit' && session.depositInfo && depositorNames && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-3 space-y-2">
            <div className="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="font-medium text-yellow-800 dark:text-yellow-300">Awaiting deposit verification</div>
              <div>Depositor 1: <span className="font-medium">{depositorNames.depositor1Name}</span></div>
              <div>Depositor 2: <span className="font-medium">{depositorNames.depositor2Name}</span></div>
              {session.depositInfo.initiatedAt && (
                <div>Initiated {new Date(session.depositInfo.initiatedAt).toLocaleString()}</div>
              )}
            </div>
            {canVerify && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => actions.setShowRejectConfirm(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/60"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={() => actions.setShowVerifyConfirm(true)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-900/60"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Verify
                </button>
              </div>
            )}
          </div>
        )}

        {/* Completed deposit info */}
        {status === 'deposited' && depositorNames && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 space-y-0.5">
            <div>Deposited by <span className="font-medium">{depositorNames.depositor1Name}</span> and <span className="font-medium">{depositorNames.depositor2Name}</span></div>
            {depositorNames.verifiedByName && (
              <div>Verified by <span className="font-medium">{depositorNames.verifiedByName}</span></div>
            )}
            {session.depositedAt && (
              <div>{new Date(session.depositedAt).toLocaleString()}</div>
            )}
          </div>
        )}

        {/* Session recorded info */}
        {(status === 'recorded' || status === 'pending_deposit' || status === 'deposited') && session.recordedAt && (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2 space-y-0.5">
            <div className="font-medium">Session recorded{session.batchNumber && <span> — Batch #{session.batchNumber}</span>}</div>
            <div>
              {new Date(session.recordedAt).toLocaleString()}
              {session.recordedBy && <span> by {session.recordedBy}</span>}
            </div>
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

      {status !== 'no_donations' && (
        <PrintableReport
          session={session}
          unitName={unitName}
          printedBy={authUser?.email}
          membersMap={membersMap}
        />
      )}

      <SessionDetailModals
        sessionId={session.id}
        editable={editable}
        envelopeCount={session.envelopes.length}
        displayIndex={displayIndex}
        members={activeMembers}
        showAddModal={actions.showAddModal}
        onCloseAddModal={() => actions.setShowAddModal(false)}
        onAdd={actions.handleAddEnvelope}
        editingEnvelopeId={actions.editingEnvelopeId}
        editingEnvelope={actions.editingEnvelope}
        onCloseEditModal={() => actions.setEditingEnvelopeId(null)}
        showRecordedModal={actions.showRecordedModal}
        onCancelRecorded={() => actions.setShowRecordedModal(false)}
        onConfirmRecorded={actions.handleMarkRecorded}
        showDepositedModal={actions.showDepositedModal}
        onCancelDeposited={() => actions.setShowDepositedModal(false)}
        onConfirmDeposited={actions.handleInitiateDeposit}
        showNoDonationsConfirm={actions.showNoDonationsConfirm}
        onCancelNoDonations={() => actions.setShowNoDonationsConfirm(false)}
        onConfirmNoDonations={actions.handleMarkNoDonations}
        showVerifyConfirm={actions.showVerifyConfirm}
        onCancelVerify={() => actions.setShowVerifyConfirm(false)}
        onConfirmVerify={actions.handleVerifyDeposit}
        showRejectConfirm={actions.showRejectConfirm}
        onCancelReject={() => actions.setShowRejectConfirm(false)}
        onConfirmReject={actions.handleRejectDeposit}
        envelopeToDelete={actions.envelopeToDelete}
        onCancelDelete={() => actions.setEnvelopeToDelete(null)}
        onConfirmDelete={actions.handleConfirmDelete}
      />
    </div>
  )
}
