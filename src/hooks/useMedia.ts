import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return match;
}
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
/** Phones, tablets and touch devices: lighter, native-scroll experience instead of scroll-scrubbed video. */
export const useLiteMotion = () => useMediaQuery('(max-width: 1024px), (pointer: coarse)');
export function useSaveData() {
  const c = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
  return !!c?.saveData;
}
/** True when the cinematic scroll experience should be replaced by the normal layout. */
export function useSimpleMode() {
  const reduced = usePrefersReducedMotion();
  return reduced || useSaveData();
}
