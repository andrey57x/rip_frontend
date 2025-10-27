import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../slices/filterSlice";
import authReducer from "../slices/authSlice";
import calculationReducer from "../slices/calculationSlice";

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    auth: authReducer,
    calculations: calculationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
