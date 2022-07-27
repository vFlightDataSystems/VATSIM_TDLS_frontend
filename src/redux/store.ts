import { configureStore } from "@reduxjs/toolkit";
import dclReducer from "./slices/dclSlice";

const store = configureStore({
  reducer: {
    dcl: dclReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
