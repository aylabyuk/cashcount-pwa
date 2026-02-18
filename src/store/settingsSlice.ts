import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'system' | 'light' | 'dark'

interface SettingsState {
  theme: Theme
}

const initialState: SettingsState = {
  theme: 'system',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = settingsSlice.actions
export default settingsSlice.reducer
