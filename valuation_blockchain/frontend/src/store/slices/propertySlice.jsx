import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  property: null, // single property
  nextPropertyId: 101, // starting ID
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    setProperty: (state, action) => {
      state.property = {
        propertyId: state.nextPropertyId, // assign numeric ID
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        estimatedLandValue: action.payload.estimatedLandValue,
        estimatedPropertyValue: null,
        owner: action.payload.owner,
        landSize: action.payload.landSize,
      };
      state.nextPropertyId += 1; // increment for next property
    },
    updateEstimatedLandValue: (state, action) => {
      if (
        state.property &&
        state.property.propertyId === action.payload.propertyId
      ) {
        state.property.estimatedLandValue = action.payload.newValue;
      }
    },
    updateOwner: (state, action) => {
      if (
        state.property &&
        state.property.propertyId === action.payload.propertyId
      ) {
        state.property.owner = action.payload.newOwner;
      }
    },
    updateEstimatedPropertyValue: (state, action) => {
      if (
        state.property &&
        state.property.propertyId === action.payload.propertyId
      ) {
        state.property.estimatedPropertyValue = action.payload.newValue;
      }
    },
  },
});

export const {
  setProperty,
  updateEstimatedLandValue,
  updateOwner,
  updateEstimatedPropertyValue,
} = propertySlice.actions;

export default propertySlice.reducer;
