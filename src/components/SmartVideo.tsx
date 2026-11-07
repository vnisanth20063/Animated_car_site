import { useEffect, useRef, useState } from 'react';
import { media } from '../data/services';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMedia';

/** Looping muted preview that plays only while on screen and falls back to its poster on error. */
export default function SmartVideo({ slug, className = '', controls = false }: { slug: string; className?: string; controls?: boolean }) {
  const m = media(slug);
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => undefined); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced, failed]);

  if (failed) return <img src={m.poster} alt="" className={className} />;
  return (
    <video
      ref={ref} className={className} src={mobile ? m.sd : m.hd} poster={m.poster}
      muted loop playsInline preload="metadata" controls={controls || reduced}
      onError={() => setFailed(true)}
    />
  );
}
