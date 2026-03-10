import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import propertyReducer from "./slices/propertySlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    property: propertyReducer,
  },
});
