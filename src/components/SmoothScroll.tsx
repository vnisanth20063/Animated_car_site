import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLiteMotion, usePrefersReducedMotion } from '../hooks/useMedia';

gsap.registerPlugin(ScrollTrigger);
// Stops pinned sections jumping when the mobile browser bar shows or hides.
ScrollTrigger.config({ ignoreMobileResize: true });
let lenisRef: Lenis | null = null;

/** Lenis smooth scrolling kept in sync with ScrollTrigger. Disabled for reduced motion. */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const lite = useLiteMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduced || lite) return; // native scrolling is smoother on touch devices
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef = null;
    };
  }, [reduced, lite]);

  // Reset scroll on route change and re-measure pinned sections.
  useEffect(() => {
    if (lenisRef) lenisRef.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
