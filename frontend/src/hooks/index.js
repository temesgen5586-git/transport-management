// src/hooks/index.js
// Export all hooks

// Context re-exports (clean import pattern)
export { default as useAuth } from './useAuth';
export { default as useTheme } from './useTheme';
export { default as useWallet } from './useWallet';
export { default as useTrip } from './useTrip';
export { default as useNotification } from './useNotification';
export { default as useLoading } from './useLoading';

// Custom hooks
export { default as useAxios } from './useAxios';
export { default as useLocalStorage } from './useLocalStorage';
export { default as useDebounce } from './useDebounce';
export { default as usePagination } from './usePagination';
export { default as useForm } from './useForm';
export { default as useToast } from './useToast';
export { default as useMediaQuery } from './useMediaQuery';
export { default as useClickOutside } from './useClickOutside';
export { default as useInterval } from './useInterval';
export { default as usePrevious } from './usePrevious';
export { default as useToggle } from './useToggle';
export { default as useScrollToTop } from './useScrollToTop';
export { default as useWindowSize } from './useWindowSize';