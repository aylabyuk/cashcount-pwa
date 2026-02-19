import { type Envelope } from '../../store/sessionsSlice'
import type { Member } from '../../hooks/useMembers'
import { formatCurrency } from '../../utils/currency'
import EnvelopeModal from '../EnvelopeModal'
import ConfirmDialog from '../ConfirmDialog'
import StatusConfirmModal from '../StatusConfirmModal'

interface Props {
  sessionId: string
  editable: boolean
  envelopeCount: number
  displayIndex: Map<string, number>
  members: Member[]

  showAddModal: boolean
  onCloseAddModal: () => void
  onAdd: (envelope: {
    count100: number
    count50: number
    count20: number
    count10: number
    count5: number
    coinsAmount: number
    chequeAmount: number
  }) => void

  editingEnvelopeId: string | null
  editingEnvelope: Envelope | null
  onCloseEditModal: () => void

  showRecordedModal: boolean
  onCancelRecorded: () => void
  onConfirmRecorded: (batchNumber: string) => void

  showDepositedModal: boolean
  onCancelDeposited: () => void
  onConfirmDeposited: (depositor1Email: string, depositor2Email: string) => void

  showNoDonationsConfirm: boolean
  onCancelNoDonations: () => void
  onConfirmNoDonations: (reason: string) => void

  showVerifyConfirm: boolean
  onCancelVerify: () => void
  onConfirmVerify: () => void

  showRejectConfirm: boolean
  onCancelReject: () => void
  onConfirmReject: () => void

  envelopeToDelete: { id: string; number: number; total: number } | null
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

export default function SessionDetailModals({
  sessionId,
  editable,
  envelopeCount,
  displayIndex,
  members,
  showAddModal,
  onCloseAddModal,
  onAdd,
  editingEnvelopeId,
  editingEnvelope,
  onCloseEditModal,
  showRecordedModal,
  onCancelRecorded,
  onConfirmRecorded,
  showDepositedModal,
  onCancelDeposited,
  onConfirmDeposited,
  showNoDonationsConfirm,
  onCancelNoDonations,
  onConfirmNoDonations,
  showVerifyConfirm,
  onCancelVerify,
  onConfirmVerify,
  showRejectConfirm,
  onCancelReject,
  onConfirmReject,
  envelopeToDelete,
  onCancelDelete,
  onConfirmDelete,
}: Props) {
  return (
    <>
      <EnvelopeModal
        mode="add"
        open={showAddModal}
        onAdd={onAdd}
        onClose={onCloseAddModal}
      />

      {editingEnvelope && (
        <EnvelopeModal
          mode="edit"
          open={editingEnvelopeId !== null}
          sessionId={sessionId}
          envelope={editingEnvelope}
          displayNumber={displayIndex.get(editingEnvelopeId!) ?? 0}
          disabled={!editable}
          onClose={onCloseEditModal}
        />
      )}

      <StatusConfirmModal
        type="recorded"
        open={showRecordedModal}
        onConfirm={onConfirmRecorded}
        onCancel={onCancelRecorded}
      />
      <StatusConfirmModal
        type="deposited"
        open={showDepositedModal}
        members={members}
        onConfirm={onConfirmDeposited}
        onCancel={onCancelDeposited}
      />
      <StatusConfirmModal
        type="no_donations"
        open={showNoDonationsConfirm}
        envelopeCount={envelopeCount}
        onConfirm={onConfirmNoDonations}
        onCancel={onCancelNoDonations}
      />

      <ConfirmDialog
        open={showVerifyConfirm}
        title="Verify Deposit?"
        message="This confirms the deposit was made correctly by both parties. This action cannot be undone."
        confirmLabel="Verify"
        confirmVariant="success"
        onConfirm={onConfirmVerify}
        onCancel={onCancelVerify}
      />
      <ConfirmDialog
        open={showRejectConfirm}
        title="Reject Deposit?"
        message="This will reject the pending deposit and return the session to Recorded status."
        confirmLabel="Reject"
        onConfirm={onConfirmReject}
        onCancel={onCancelReject}
      />

      <ConfirmDialog
        open={envelopeToDelete !== null}
        title="Delete Envelope?"
        message={
          envelopeToDelete
            ? `This will permanently delete Envelope #${envelopeToDelete.number} (${formatCurrency(envelopeToDelete.total)}). This cannot be undone.`
            : ''
        }
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </>
  )
}
