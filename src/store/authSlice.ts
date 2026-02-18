import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}

export interface UnitInfo {
  unitId: string
  unitName: string
}

type AuthStatus = 'loading' | 'unauthenticated' | 'no_unit' | 'ready'

interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  unit: UnitInfo | null
  error: string | null
}

const initialState: AuthState = {
  status: 'loading',
  user: null,
  unit: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading'
      state.error = null
    },
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    setAuthUnit(state, action: PayloadAction<UnitInfo>) {
      state.unit = action.payload
      state.status = 'ready'
      state.error = null
    },
    setAuthNoUnit(state) {
      state.status = 'no_unit'
      state.unit = null
      state.error = null
    },
    setAuthUnauthenticated(state) {
      state.status = 'unauthenticated'
      state.user = null
      state.unit = null
      state.error = null
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
  },
})

export const {
  setAuthLoading,
  setAuthUser,
  setAuthUnit,
  setAuthNoUnit,
  setAuthUnauthenticated,
  setAuthError,
} = authSlice.actions

export default authSlice.reducer
