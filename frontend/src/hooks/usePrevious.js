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
 *       // Count increased
 *     }
 *   }, [count, prevCount]);
 */
const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;