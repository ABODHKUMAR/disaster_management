import { configureStore } from '@reduxjs/toolkit';
import disasterFormReducer from '../features/disaster/disasterFormSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    disasterForm: disasterFormReducer, 
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
