import * as React from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    // Initial state check
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  React.useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value to be safe
    setMatches(media.matches);

    // Modern matchMedia listener (more efficient than 'resize')
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Support both older and newer browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }
    
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
