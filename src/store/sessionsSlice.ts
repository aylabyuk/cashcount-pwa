import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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
}

export interface CountingSession {
  id: string
  date: string // YYYY-MM-DD, always a Sunday
  envelopes: Envelope[]
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
  },
})

export const {
  addSession,
  deleteSession,
  addEnvelope,
  updateEnvelope,
  deleteEnvelope,
} = sessionsSlice.actions

export default sessionsSlice.reducer
