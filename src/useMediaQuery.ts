import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. The marketing pages style with inline
 * `style={}` objects, which CSS media queries can't override — so responsive
 * layout is driven from JS by switching the inline values on this signal.
 */
export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on phone / small-tablet widths — the marketing breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
