import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollToTop – Scroll to top on route change
 * 
 * Usage:
 *   useScrollToTop(); // Place in App.jsx or layout component
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
};

export default useScrollToTop;