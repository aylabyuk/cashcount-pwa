import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { PURGE_MONTHS } from '../utils/constants'

export interface Envelope {
  id: string
  number: number
  count100: number
  count50: number
  count20: number
  count10: number
  count5: number
  coinsAmount: number // cents
  chequeAmount: number // cents
  lastUpdatedBy?: string // email
}

export type SessionStatus = 'active' | 'recorded' | 'pending_deposit' | 'deposited' | 'no_donations'

export interface DepositInfo {
  depositor1: string       // email of P1
  depositor2: string       // email of P2
  initiatedBy: string      // email of who initiated
  initiatedAt: string      // ISO datetime
  verifiedBy?: string      // email of who verified (set on approval)
}

export interface CountingSession {
  id: string
  date: string // YYYY-MM-DD, always a Sunday
  envelopes: Envelope[]
  status: SessionStatus
  createdBy?: string           // email
  lastUpdatedBy?: string       // email
  recordedAt?: string        // ISO datetime
  recordedBy?: string        // email
  batchNumber?: string       // required when marking session recorded
  depositedAt?: string       // ISO datetime
  depositInfo?: DepositInfo
  noDonationsAt?: string         // ISO datetime
  noDonationsReason?: string     // required reason/note
}

interface SessionsState {
  sessions: CountingSession[]
}

const initialState: SessionsState = {
  sessions: [],
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

export function getEnvelopeCashTotal(e: Envelope): number {
  return (
    e.count100 * 10000 +
    e.count50 * 5000 +
    e.count20 * 2000 +
    e.count10 * 1000 +
    e.count5 * 500
  )
}

export function getEnvelopeTotal(e: Envelope): number {
  return getEnvelopeCashTotal(e) + e.coinsAmount + e.chequeAmount
}

export function getSessionTotals(session: CountingSession) {
  const envelopes = session.envelopes
  return {
    total100: envelopes.reduce((sum, e) => sum + e.count100, 0),
    total50: envelopes.reduce((sum, e) => sum + e.count50, 0),
    total20: envelopes.reduce((sum, e) => sum + e.count20, 0),
    total10: envelopes.reduce((sum, e) => sum + e.count10, 0),
    total5: envelopes.reduce((sum, e) => sum + e.count5, 0),
    totalCash: envelopes.reduce((sum, e) => sum + getEnvelopeCashTotal(e), 0),
    totalCoins: envelopes.reduce((sum, e) => sum + e.coinsAmount, 0),
    totalCheques: envelopes.reduce((sum, e) => sum + e.chequeAmount, 0),
    grandTotal: envelopes.reduce((sum, e) => sum + getEnvelopeTotal(e), 0),
  }
}

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession(state, action: PayloadAction<{ date: string }>) {
      state.sessions.push({
        id: crypto.randomUUID(),
        date: action.payload.date,
        envelopes: [],
        status: 'active',
      })
      state.sessions.sort((a, b) => b.date.localeCompare(a.date))
    },
    deleteSession(state, action: PayloadAction<string>) {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload)
    },
    addEnvelope(state, action: PayloadAction<{ sessionId: string; envelope?: Partial<Omit<Envelope, 'id' | 'number'>> }>) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session) return
      const maxNum = session.envelopes.reduce((max, e) => Math.max(max, e.number), 0)
      const envelope = createEnvelope(maxNum + 1)
      if (action.payload.envelope) {
        Object.assign(envelope, action.payload.envelope)
      }
      session.envelopes.push(envelope)
    },
    updateEnvelope(
      state,
      action: PayloadAction<{
        sessionId: string
        envelopeId: string
        changes: Partial<Omit<Envelope, 'id' | 'number'>>
      }>
    ) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session) return
      const envelope = session.envelopes.find((e) => e.id === action.payload.envelopeId)
      if (!envelope) return
      Object.assign(envelope, action.payload.changes)
    },
    deleteEnvelope(
      state,
      action: PayloadAction<{ sessionId: string; envelopeId: string }>
    ) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session) return
      session.envelopes = session.envelopes.filter(
        (e) => e.id !== action.payload.envelopeId
      )
    },
    markRecorded(state, action: PayloadAction<{ sessionId: string; batchNumber: string }>) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session || session.status !== 'active') return
      session.status = 'recorded'
      session.recordedAt = new Date().toISOString()
      session.batchNumber = action.payload.batchNumber
    },
    initiateDeposit(
      state,
      action: PayloadAction<{ sessionId: string; depositor1: string; depositor2: string }>
    ) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session || session.status !== 'recorded') return
      session.status = 'pending_deposit'
      session.depositInfo = {
        depositor1: action.payload.depositor1,
        depositor2: action.payload.depositor2,
        initiatedBy: action.payload.depositor1,
        initiatedAt: new Date().toISOString(),
      }
    },
    verifyDeposit(
      state,
      action: PayloadAction<{ sessionId: string; verifiedBy: string }>
    ) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session || session.status !== 'pending_deposit') return
      session.status = 'deposited'
      session.depositedAt = new Date().toISOString()
      if (session.depositInfo) {
        session.depositInfo.verifiedBy = action.payload.verifiedBy
      }
    },
    rejectDeposit(
      state,
      action: PayloadAction<{ sessionId: string }>
    ) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session || session.status !== 'pending_deposit') return
      session.status = 'recorded'
      session.depositInfo = undefined
      session.depositedAt = undefined
    },
    markNoDonations(state, action: PayloadAction<{ sessionId: string; reason: string }>) {
      const session = state.sessions.find((s) => s.id === action.payload.sessionId)
      if (!session || session.status !== 'active') return
      session.status = 'no_donations'
      session.noDonationsAt = new Date().toISOString()
      session.noDonationsReason = action.payload.reason
      session.envelopes = []
    },
    reactivateSession(state, action: PayloadAction<string>) {
      const session = state.sessions.find((s) => s.id === action.payload)
      if (!session || session.status !== 'no_donations') return
      session.status = 'active'
      session.noDonationsAt = undefined
      session.noDonationsReason = undefined
    },
    purgeOldSessions(state) {
      const cutoff = new Date()
      cutoff.setMonth(cutoff.getMonth() - PURGE_MONTHS)
      const cutoffStr = cutoff.toISOString().slice(0, 10)
      state.sessions = state.sessions.filter((s) => s.date >= cutoffStr)
    },
    setSessions(state, action: PayloadAction<CountingSession[]>) {
      state.sessions = action.payload
    },
  },
})

export const {
  addSession,
  deleteSession,
  addEnvelope,
  updateEnvelope,
  deleteEnvelope,
  markRecorded,
  initiateDeposit,
  verifyDeposit,
  rejectDeposit,
  markNoDonations,
  reactivateSession,
  purgeOldSessions,
  setSessions,
} = sessionsSlice.actions

export default sessionsSlice.reducer
