import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ViewState {
  current: 'list' | 'detail' | 'settings'
  selectedSessionId: string | null
}

const initialState: ViewState = {
  current: 'list',
  selectedSessionId: null,
}

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    navigateToList(state) {
      state.current = 'list'
    },
    navigateToDetail(state, action: PayloadAction<string>) {
      state.current = 'detail'
      state.selectedSessionId = action.payload
    },
    navigateToSettings(state) {
      state.current = 'settings'
    },
  },
})

export const { navigateToList, navigateToDetail, navigateToSettings } = viewSlice.actions
export default viewSlice.reducer
