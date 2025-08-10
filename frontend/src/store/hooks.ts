import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Custom hook cho dispatch với type safety
// 1. useAppDispatch - Để gửi actions
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook cho selector với type safety
// 2. useAppSelector - Để lấy state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
