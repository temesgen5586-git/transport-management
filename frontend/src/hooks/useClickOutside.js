import { useEffect, useRef } from 'react';

/**
 * useClickOutside – Detect clicks outside a referenced element
 * 
 * @param {function} callback - Function to call when clicking outside
 * @param {array} excludeRefs - Additional refs to exclude
 * @returns {object} ref - Ref to attach to the element
 * 
 * Usage:
 *   const ref = useClickOutside(() => setIsOpen(false));
 *   <div ref={ref}>Content</div>
 */
const useClickOutside = (callback, excludeRefs = []) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isExcluded = excludeRefs.some(excludeRef =>
        excludeRef.current && excludeRef.current.contains(event.target)
      );

      if (ref.current && !ref.current.contains(event.target) && !isExcluded) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, excludeRefs]);

  return ref;
};

export default useClickOutside;