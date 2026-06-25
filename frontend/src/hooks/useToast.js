import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * useToast – Toast notification helpers
 * 
 * @returns {object} { success, error, info, warn, custom }
 * 
 * Usage:
 *   const { success, error } = useToast();
 *   success('Booking confirmed!');
 *   error('Something went wrong.');
 */
const useToast = () => {
  const success = useCallback((message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background: '#10b981',
        color: '#fff',
        ...options.style,
      },
      ...options,
    });
  }, []);

  const error = useCallback((message, options = {}) => {
    return toast.error(message, {
      duration: 4000,
      style: {
        background: '#ef4444',
        color: '#fff',
        ...options.style,
      },
      ...options,
    });
  }, []);

  const info = useCallback((message, options = {}) => {
    return toast(message, {
      duration: 3000,
      style: {
        background: '#3b82f6',
        color: '#fff',
        ...options.style,
      },
      ...options,
    });
  }, []);

  const warn = useCallback((message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: '#f59e0b',
        color: '#fff',
        ...options.style,
      },
      ...options,
    });
  }, []);

  const custom = useCallback((message, options = {}) => {
    return toast(message, options);
  }, []);

  const dismiss = useCallback(() => {
    toast.dismiss();
  }, []);

  return { success, error, info, warn, custom, dismiss };
};

export default useToast;