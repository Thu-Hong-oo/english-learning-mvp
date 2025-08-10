import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Custom hook cho dispatch với type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook cho selector với type safety
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
