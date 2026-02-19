import { useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  addEnvelope,
  deleteEnvelope,
  markRecorded,
  initiateDeposit,
  verifyDeposit,
  rejectDeposit,
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
  const userEmail = useAppSelector((s) => s.auth.user?.email ?? '')

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEnvelopeId, setEditingEnvelopeId] = useState<string | null>(null)
  const [envelopeToDelete, setEnvelopeToDelete] = useState<{
    id: string
    number: number
    total: number
  } | null>(null)
  const [showRecordedModal, setShowRecordedModal] = useState(false)
  const [showDepositedModal, setShowDepositedModal] = useState(false)
  const [showNoDonationsConfirm, setShowNoDonationsConfirm] = useState(false)
  const [showVerifyConfirm, setShowVerifyConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

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

  const handleMarkRecorded = useCallback(
    (batchNumber: string) => {
      if (!session) return
      dispatch(markRecorded({ sessionId: session.id, batchNumber }))
      setShowRecordedModal(false)
    },
    [dispatch, session]
  )

  const handleInitiateDeposit = useCallback(
    (depositor1Email: string, depositor2Email: string) => {
      if (!session) return
      dispatch(initiateDeposit({
        sessionId: session.id,
        depositor1: depositor1Email,
        depositor2: depositor2Email,
      }))
      setShowDepositedModal(false)
    },
    [dispatch, session]
  )

  const handleVerifyDeposit = useCallback(() => {
    if (!session) return
    dispatch(verifyDeposit({ sessionId: session.id, verifiedBy: userEmail }))
    setShowVerifyConfirm(false)
  }, [dispatch, session, userEmail])

  const handleRejectDeposit = useCallback(() => {
    if (!session) return
    dispatch(rejectDeposit({ sessionId: session.id }))
    setShowRejectConfirm(false)
  }, [dispatch, session])

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
    showRecordedModal,
    setShowRecordedModal,
    showDepositedModal,
    setShowDepositedModal,
    showNoDonationsConfirm,
    setShowNoDonationsConfirm,
    showVerifyConfirm,
    setShowVerifyConfirm,
    showRejectConfirm,
    setShowRejectConfirm,

    handleAddEnvelope,
    handleDeleteClick,
    handleConfirmDelete,
    handleMarkRecorded,
    handleInitiateDeposit,
    handleVerifyDeposit,
    handleRejectDeposit,
    handleMarkNoDonations,
    handleReactivate,
  }
}
