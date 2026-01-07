import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeStep: 0,
  latitude: null,
  longitude: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    setCoordinates: (state, action) => {
      state.latitude = action.payload.lat;
      state.longitude = action.payload.lon;
    },
  },
});

export const { setActiveStep, setCoordinates } = appSlice.actions;
export default appSlice.reducer;
