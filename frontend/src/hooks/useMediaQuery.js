import { useState, useEffect } from 'react';

/**
 * useMediaQuery – Check if a media query matches
 * 
 * @param {string} query - Media query string
 * @returns {boolean} Whether the query matches
 * 
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (event) => setMatches(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query, matches]);

  return matches;
};

export default useMediaQuery;