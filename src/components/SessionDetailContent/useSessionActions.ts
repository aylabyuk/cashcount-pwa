import { useState, useCallback } from 'react'
import { useAppDispatch } from '../../store'
import {
  addEnvelope,
  deleteEnvelope,
  markReportPrinted,
  markDeposited,
  markNoDonations,
  reactivateSession,
  getEnvelopeTotal,
  type CountingSession,
} from '../../store/sessionsSlice'

export function useSessionActions(
  session: CountingSession | undefined,
  displayIndex: Map<string, number>,
) {
  const dispatch = useAppDispatch()

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEnvelopeId, setEditingEnvelopeId] = useState<string | null>(null)
  const [envelopeToDelete, setEnvelopeToDelete] = useState<{
    id: string
    number: number
    total: number
  } | null>(null)
  const [showReportPrintedModal, setShowReportPrintedModal] = useState(false)
  const [showDepositedModal, setShowDepositedModal] = useState(false)
  const [showNoDonationsConfirm, setShowNoDonationsConfirm] = useState(false)

  const editingEnvelope = editingEnvelopeId
    ? session?.envelopes.find((e) => e.id === editingEnvelopeId) ?? null
    : null

  const handleAddEnvelope = useCallback(
    (envelope: {
      count100: number
      count50: number
      count20: number
      count10: number
      count5: number
      coinsAmount: number
      chequeAmount: number
    }) => {
      if (!session) return
      dispatch(addEnvelope({ sessionId: session.id, envelope }))
      setShowAddModal(false)
    },
    [dispatch, session]
  )

  const handleDeleteClick = useCallback(
    (envelope: { id: string; number: number }) => {
      if (!session) return
      const found = session.envelopes.find((e) => e.id === envelope.id)!
      const total = getEnvelopeTotal(found)
      setEnvelopeToDelete({
        id: envelope.id,
        number: displayIndex.get(envelope.id) ?? envelope.number,
        total,
      })
    },
    [session, displayIndex]
  )

  const handleConfirmDelete = useCallback(() => {
    if (envelopeToDelete && session) {
      dispatch(deleteEnvelope({ sessionId: session.id, envelopeId: envelopeToDelete.id }))
      setEnvelopeToDelete(null)
    }
  }, [dispatch, session, envelopeToDelete])

  const handleMarkReportPrinted = useCallback(
    (batchNumber: string) => {
      if (!session) return
      dispatch(markReportPrinted({ sessionId: session.id, batchNumber }))
      setShowReportPrintedModal(false)
    },
    [dispatch, session]
  )

  const handleMarkDeposited = useCallback(
    (name1: string, name2: string) => {
      if (!session) return
      dispatch(markDeposited({ sessionId: session.id, name1, name2 }))
      setShowDepositedModal(false)
    },
    [dispatch, session]
  )

  const handleMarkNoDonations = useCallback(
    (reason: string) => {
      if (!session) return
      dispatch(markNoDonations({ sessionId: session.id, reason }))
      setShowNoDonationsConfirm(false)
    },
    [dispatch, session]
  )

  const handleReactivate = useCallback(() => {
    if (!session) return
    dispatch(reactivateSession(session.id))
  }, [dispatch, session])

  return {
    showAddModal,
    setShowAddModal,
    editingEnvelopeId,
    setEditingEnvelopeId,
    editingEnvelope,
    envelopeToDelete,
    setEnvelopeToDelete,
    showReportPrintedModal,
    setShowReportPrintedModal,
    showDepositedModal,
    setShowDepositedModal,
    showNoDonationsConfirm,
    setShowNoDonationsConfirm,

    handleAddEnvelope,
    handleDeleteClick,
    handleConfirmDelete,
    handleMarkReportPrinted,
    handleMarkDeposited,
    handleMarkNoDonations,
    handleReactivate,
  }
}
