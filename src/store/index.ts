import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import sessionsReducer, { type CountingSession } from './sessionsSlice'
import settingsReducer from './settingsSlice'

const STORAGE_KEY = 'cashcount_sessions'
const SETTINGS_KEY = 'cashcount_settings'

function loadSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return undefined
    return migrateSessions(JSON.parse(data))
  } catch {
    return undefined
  }
}

function migrateSessions(data: { sessions: Record<string, unknown>[] }): { sessions: CountingSession[] } {
  return {
    ...data,
    sessions: data.sessions.map((s) => ({
      ...s,
      status: s.status ?? 'active',
    })) as CountingSession[],
  }
}

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : undefined
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: {
    sessions: sessionsReducer,
    settings: settingsReducer,
  },
  preloadedState: {
    ...(loadSessions() ? { sessions: loadSessions()! } : {}),
    settings: loadSettings() ?? { theme: 'system' as const },
  },
})

// Persist to localStorage on every state change
store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sessions))
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
