import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
  latitute: 0,
  longtitue: 0,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setCoordinates: (state, action) => {
      state.latitute = action.payload.lat;
      state.longtitue = action.payload.lon;
    },
  },
});

export const { setActiveStep, setCoordinates } = appSlice.actions;
export default appSlice.reducer;
