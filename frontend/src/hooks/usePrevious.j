import { useEffect, useRef } from 'react';

/**
 * usePrevious – Track the previous value of a variable
 * 
 * @param {any} value - Current value
 * @returns {any} Previous value
 * 
 * Usage:
 *   const prevCount = usePrevious(count);
 *   useEffect(() => {
 *     if (prevCount !== undefined && count > prevCount) {
 *       console.log('Count increased from', prevCount, 'to', count);
 *     }
 *   }, [count, prevCount]);
 * 
 * Example with form:
 *   const prevUser = usePrevious(user);
 *   useEffect(() => {
 *     if (prevUser?.id !== user?.id) {
 *       // User changed, fetch new data
 *       fetchUserData(user.id);
 *     }
 *   }, [user]);
 */
const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;