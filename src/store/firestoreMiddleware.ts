import type { Middleware } from '@reduxjs/toolkit'
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { RootState } from './index'
import type { CountingSession, Envelope } from './sessionsSlice'
import { PURGE_MONTHS } from '../utils/constants'

const SESSION_ACTIONS = new Set([
  'sessions/addSession',
  'sessions/deleteSession',
  'sessions/addEnvelope',
  'sessions/updateEnvelope',
  'sessions/deleteEnvelope',
  'sessions/markReportPrinted',
  'sessions/markDeposited',
  'sessions/markNoDonations',
  'sessions/reactivateSession',
  'sessions/purgeOldSessions',
])

function sessionToFirestore(session: CountingSession, userEmail: string) {
  return {
    date: session.date,
    status: session.status,
    envelopes: session.envelopes,
    createdBy: session.createdBy ?? null,
    lastUpdatedBy: userEmail,
    reportPrintedAt: session.reportPrintedAt ?? null,
    reportPrintedBy: session.reportPrintedBy ?? null,
    batchNumber: session.batchNumber ?? null,
    depositedAt: session.depositedAt ?? null,
    depositedBy: session.depositedBy ?? null,
    noDonationsAt: session.noDonationsAt ?? null,
    noDonationsReason: session.noDonationsReason ?? null,
    updatedAt: serverTimestamp(),
  }
}

function createEnvelope(number: number): Envelope {
  return {
    id: crypto.randomUUID(),
    number,
    count100: 0,
    count50: 0,
    count20: 0,
    count10: 0,
    count5: 0,
    coinsAmount: 0,
    chequeAmount: 0,
  }
}

export const firestoreMiddleware: Middleware = (storeAPI) => (next) => (action: unknown) => {
  const { type, payload } = action as { type: string; payload: unknown }

  if (!SESSION_ACTIONS.has(type)) {
    return next(action)
  }

  const state = storeAPI.getState() as RootState
  const unitId = state.auth.unit?.unitId ?? null

  // No unit — fall through to local reducer (graceful degradation)
  if (!unitId) {
    return next(action)
  }

  const userEmail = state.auth.user?.email?.toLowerCase() ?? 'unknown'

  // Write to Firestore; suppress Redux reducer (onSnapshot will update state)
  handleFirestoreWrite(type, payload, state, unitId, userEmail).catch((error) => {
    console.error(`Firestore write failed for ${type}:`, error)
  })
}

async function handleFirestoreWrite(
  type: string,
  payload: unknown,
  state: RootState,
  unitId: string,
  userEmail: string,
) {
  const sessions = state.sessions.sessions
  const p = payload as Record<string, unknown>

  switch (type) {
    case 'sessions/addSession': {
      const newId = crypto.randomUUID()
      const newSession: CountingSession = {
        id: newId,
        date: p.date as string,
        envelopes: [],
        status: 'active',
        createdBy: userEmail,
      }
      await setDoc(
        doc(collection(db, 'units', unitId, 'sessions'), newId),
        { ...sessionToFirestore(newSession, userEmail), createdBy: userEmail, createdAt: serverTimestamp() }
      )
      break
    }

    case 'sessions/deleteSession': {
      const sessionId = payload as string
      await deleteDoc(doc(db, 'units', unitId, 'sessions', sessionId))
      break
    }

    case 'sessions/addEnvelope': {
      const { sessionId, envelope: partialEnvelope } = p as {
        sessionId: string
        envelope?: Partial<Omit<Envelope, 'id' | 'number'>>
      }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return
      const maxNum = session.envelopes.reduce((max, e) => Math.max(max, e.number), 0)
      const newEnvelope = { ...createEnvelope(maxNum + 1), ...partialEnvelope, lastUpdatedBy: userEmail }
      const updatedSession = {
        ...session,
        envelopes: [...session.envelopes, newEnvelope],
      }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/updateEnvelope': {
      const { sessionId, envelopeId, changes } = p as {
        sessionId: string
        envelopeId: string
        changes: Partial<Omit<Envelope, 'id' | 'number'>>
      }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return
      const updatedEnvelopes = session.envelopes.map((e) =>
        e.id === envelopeId ? { ...e, ...changes, lastUpdatedBy: userEmail } : e
      )
      const updatedSession = { ...session, envelopes: updatedEnvelopes }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/deleteEnvelope': {
      const { sessionId, envelopeId } = p as { sessionId: string; envelopeId: string }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) return
      const updatedEnvelopes = session.envelopes.filter((e) => e.id !== envelopeId)
      const updatedSession = { ...session, envelopes: updatedEnvelopes }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/markReportPrinted': {
      const { sessionId, batchNumber } = p as { sessionId: string; batchNumber: string }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session || session.status !== 'active') return
      const updatedSession: CountingSession = {
        ...session,
        status: 'report_printed',
        reportPrintedAt: new Date().toISOString(),
        reportPrintedBy: userEmail,
        batchNumber,
      }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/markDeposited': {
      const { sessionId, name1, name2 } = p as { sessionId: string; name1: string; name2: string }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session || session.status !== 'report_printed') return
      const updatedSession: CountingSession = {
        ...session,
        status: 'deposited',
        depositedAt: new Date().toISOString(),
        depositedBy: [name1, name2],
      }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/markNoDonations': {
      const { sessionId, reason } = p as { sessionId: string; reason: string }
      const session = sessions.find((s) => s.id === sessionId)
      if (!session || session.status !== 'active') return
      const updatedSession: CountingSession = {
        ...session,
        status: 'no_donations',
        noDonationsAt: new Date().toISOString(),
        noDonationsReason: reason,
        envelopes: [],
      }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/reactivateSession': {
      const sessionId = payload as string
      const session = sessions.find((s) => s.id === sessionId)
      if (!session || session.status !== 'no_donations') return
      const updatedSession: CountingSession = {
        ...session,
        status: 'active',
        noDonationsAt: undefined,
        noDonationsReason: undefined,
      }
      await setDoc(
        doc(db, 'units', unitId, 'sessions', sessionId),
        sessionToFirestore(updatedSession, userEmail),
        { merge: true }
      )
      break
    }

    case 'sessions/purgeOldSessions': {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - PURGE_MONTHS)
      const cutoffStr = cutoff.toISOString().slice(0, 10)
      const oldSessions = sessions.filter((s) => s.date < cutoffStr)
      await Promise.all(
        oldSessions.map((s) =>
          deleteDoc(doc(db, 'units', unitId, 'sessions', s.id))
        )
      )
      break
    }
  }
}
