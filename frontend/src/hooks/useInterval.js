import { useEffect, useRef } from 'react';

/**
 * useInterval – SetInterval as a React hook
 * 
 * @param {function} callback - Function to run
 * @param {number} delay - Delay in milliseconds (null to pause)
 * 
 * Usage:
 *   useInterval(() => {
 *     fetchLiveTrips();
 *   }, 10000);
 */
const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;