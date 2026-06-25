/**
 * useLoading – Loading state hook
 * Re-exports useLoading from LoadingContext for cleaner imports
 * 
 * Usage:
 *   import { useLoading } from '../hooks';
 * 
 *   const { isLoading, showLoading, hideLoading } = useLoading();
 */

import { useLoading } from '../context/LoadingContext';

export default useLoading;