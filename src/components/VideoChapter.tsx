import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryOf, media, type Service } from '../data/services';
import { useScrollVideo } from '../hooks/useScrollVideo';
import { forceMuted } from '../utils/video';
import AddToCartButton from './AddToCartButton';

interface Props { service: Service; index: number; total: number }

/** Desktop chapter: pinned section, scroll scrubs video.currentTime forward and in reverse. */
export default function VideoChapter({ service, index, total }: Props) {
  const m = media(service.slug);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(index < 2);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLoad(e.isIntersecting), { rootMargin: '150% 0px 150% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (v && !load) { v.removeAttribute('src'); v.load(); }
    if (v) forceMuted(v);
  }, [load]);

  useScrollVideo({ sectionRef, videoRef, overlayRef, barRef, enabled: !failed });

  const num = String(index + 1).padStart(2, '0');
  return (
    <div ref={wrapRef}>
      <section ref={sectionRef} className="relative h-screen h-svh w-full overflow-hidden bg-black" aria-label={`Chapter ${index + 1} of ${total}: ${service.title}`}>
        {failed ? (
          <img src={m.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef} className="absolute inset-0 h-full w-full object-cover" poster={m.poster}
            src={load ? m.hd : undefined} muted playsInline preload={load ? 'auto' : 'none'} onError={() => load && setFailed(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div ref={overlayRef} className="absolute inset-x-0 bottom-0 section pb-20" style={{ opacity: 0 }}>
          <p className="mb-3 text-sm text-mist">Chapter {num} of {String(total).padStart(2, '0')} · {categoryOf(service.category).label}</p>
          <h3 className="headline max-w-4xl text-[clamp(2rem,6vw,4.75rem)]">{service.title}</h3>
          <p className="mt-4 max-w-xl text-base text-white/80">{service.short}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/services/${service.slug}`} className="btn-ghost bg-ink/60">View details</Link>
            <AddToCartButton id={service.slug} />
          </div>
          {failed && <p className="mt-4 text-xs text-mist">The video could not be loaded. Showing a still image instead.</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden>
          <div ref={barRef} className="h-full origin-left bg-ember" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span className="absolute right-8 top-24 font-display text-sm text-white/70" aria-hidden>{num} / {String(total).padStart(2, '0')}</span>
      </section>
    </div>
  );
}
