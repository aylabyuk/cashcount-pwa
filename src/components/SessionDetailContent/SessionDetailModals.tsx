import { type Envelope } from '../../store/sessionsSlice'
import { formatCurrency } from '../../utils/currency'
import EnvelopeModal from '../EnvelopeModal'
import ConfirmDialog from '../ConfirmDialog'
import StatusConfirmModal from '../StatusConfirmModal'

interface Props {
  sessionId: string
  editable: boolean
  envelopeCount: number
  displayIndex: Map<string, number>

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

  showReportPrintedModal: boolean
  onCancelReportPrinted: () => void
  onConfirmReportPrinted: (batchNumber: string) => void

  showDepositedModal: boolean
  onCancelDeposited: () => void
  onConfirmDeposited: (name1: string, name2: string) => void

  showNoDonationsConfirm: boolean
  onCancelNoDonations: () => void
  onConfirmNoDonations: (reason: string) => void

  envelopeToDelete: { id: string; number: number; total: number } | null
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

export default function SessionDetailModals({
  sessionId,
  editable,
  envelopeCount,
  displayIndex,
  showAddModal,
  onCloseAddModal,
  onAdd,
  editingEnvelopeId,
  editingEnvelope,
  onCloseEditModal,
  showReportPrintedModal,
  onCancelReportPrinted,
  onConfirmReportPrinted,
  showDepositedModal,
  onCancelDeposited,
  onConfirmDeposited,
  showNoDonationsConfirm,
  onCancelNoDonations,
  onConfirmNoDonations,
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
        type="report_printed"
        open={showReportPrintedModal}
        onConfirm={onConfirmReportPrinted}
        onCancel={onCancelReportPrinted}
      />
      <StatusConfirmModal
        type="deposited"
        open={showDepositedModal}
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
