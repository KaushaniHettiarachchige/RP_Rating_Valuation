import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  user: null,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export const { login, logout } = appSlice.actions
export default appSlice.reducer
