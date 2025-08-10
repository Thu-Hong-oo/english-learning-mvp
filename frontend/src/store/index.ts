import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Cấu hình Redux store
export const store = configureStore({
  // Kết hợp tất cả reducers
  reducer: {
    auth: authReducer,    // Quản lý authentication state
    user: userReducer,    // Quản lý user profile và settings
  },
  
  // Cấu hình middleware (Redux Toolkit tự động thêm thunk middleware)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Tắt serializable check cho một số actions (nếu cần)
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.token'], // Bỏ qua check cho token
      },
    }),
  
  // Cấu hình dev tools
  devTools: import.meta.env.NODE_ENV !== 'production',
});

// Định nghĩa kiểu dữ liệu cho Root State
export type RootState = ReturnType<typeof store.getState>;

// Định nghĩa kiểu dữ liệu cho App Dispatch
export type AppDispatch = typeof store.dispatch;

// Export store để sử dụng trong các component
export default store;
