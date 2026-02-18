import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import sessionsReducer from './sessionsSlice'
import settingsReducer from './settingsSlice'
import viewReducer from './viewSlice'
import authReducer from './authSlice'
import { firestoreMiddleware } from './firestoreMiddleware'

const SETTINGS_KEY = 'cashcount_settings'

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
    view: viewReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['sessions/setSessions'],
      },
    }).concat(firestoreMiddleware),
  preloadedState: {
    sessions: { sessions: [] },
    settings: loadSettings() ?? { theme: 'system' as const },
  },
})

// Persist settings to localStorage (sessions now come from Firestore)
store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings))
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
