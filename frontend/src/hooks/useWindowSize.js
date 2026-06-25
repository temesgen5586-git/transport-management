import { useState, useEffect } from 'react';

/**
 * useWindowSize – Get current window dimensions
 * 
 * @returns {object} { width, height }
 * 
 * Usage:
 *   const { width, height } = useWindowSize();
 */
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};


export default useWindowSize;