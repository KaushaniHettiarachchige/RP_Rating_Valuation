import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});

export const { setActiveStep } = appSlice.actions;
export default appSlice.reducer;
