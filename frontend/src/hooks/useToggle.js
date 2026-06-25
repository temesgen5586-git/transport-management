import { useState, useCallback } from 'react';

/**
 * useToggle – Toggle a boolean state
 * 
 * @param {boolean} initialValue - Initial state
 * @returns {[boolean, function]} [state, toggle]
 * 
 * Usage:
 *   const [isOpen, toggle] = useToggle(false);
 *   <button onClick={toggle}>Toggle</button>
 */
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
};

export default useToggle;