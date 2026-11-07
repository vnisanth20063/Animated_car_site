import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryOf, media, type Service } from '../data/services';
import { frameCounts } from '../data/frames';
import AddToCartButton from './AddToCartButton';

interface Props { service: Service; index: number; total: number }

const frameUrl = (slug: string, i: number) => `/frames/${slug}/${String(i + 1).padStart(3, '0')}.webp`;

/** Load order: coarse to fine, so scrubbing works after a few frames and sharpens as the rest arrive. */
function loadOrder(count: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  }
  if (!seen.has(count - 1)) order.splice(1, 0, count - 1);
  return order;
}

/**
 * Phone / tablet chapter: native CSS sticky (compositor-driven, no scroll jank) and a canvas that draws
 * pre-extracted frames. Scroll position picks the frame, so it scrubs forward and in reverse smoothly
 * without asking the phone to seek a video.
 */
export default function FrameChapter({ service, index, total }: Props) {
  const m = media(service.slug);
  const count = frameCounts[service.slug] ?? 0;
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const redraw = useRef<() => void>(() => undefined);
  const [active, setActive] = useState(index < 2);

  // Keep frames in memory only for the current and neighbouring chapters.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '120% 0px 120% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !count) return;
    let cancelled = false;
    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    framesRef.current = frames;
    const queue = loadOrder(count);
    let next = 0;
    const worker = async () => {
      while (!cancelled && next < queue.length) {
        const i = queue[next++];
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = 'async';
          img.onload = () => { if (!cancelled) { frames[i] = img; redraw.current(); } resolve(); };
          img.onerror = () => resolve();
          img.src = frameUrl(service.slug, i);
        });
      }
    };
    const workers = Array.from({ length: 5 }, worker);
    return () => {
      cancelled = true;
      void workers;
      frames.forEach((img) => { if (img) { img.onload = null; img.src = ''; } });
      if (framesRef.current === frames) framesRef.current = [];
    };
  }, [active, count, service.slug]);

  // Scroll -> frame. Runs only while this chapter is near the viewport.
  useEffect(() => {
    const wrap = wrapRef.current;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !section || !canvas || !count) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let target = 0;
    let current = 0;
    let lastDrawn = -1;
    let raf = 0;
    let running = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(section.clientWidth * dpr);
      const h = Math.round(section.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; lastDrawn = -1; }
    };

    const draw = (idx: number) => {
      const frames = framesRef.current;
      let img = frames[idx];
      if (!img || !img.naturalWidth) {
        img = undefined;
        for (let d = 1; d < count && !img; d++) {
          const a = frames[idx - d]; const b = frames[idx + d];
          if (a && a.naturalWidth) img = a; else if (b && b.naturalWidth) img = b;
        }
      }
      if (!img) return false;
      const cw = canvas.width; const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight); // cover
      const dw = img.naturalWidth * scale; const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      return true;
    };
    redraw.current = () => { lastDrawn = -1; };

    const tick = () => {
      const r = wrap.getBoundingClientRect();
      const range = r.height - section.clientHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      target = p * (count - 1);
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.02) current = target;
      const idx = Math.round(current);
      if (idx !== lastDrawn && draw(idx)) lastDrawn = idx;
      if (overlayRef.current) overlayRef.current.style.opacity = String(Math.min(1, 0.35 + p / 0.1, (1 - p) / 0.12));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; size(); raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(wrap);
    const ro = new ResizeObserver(size);
    ro.observe(section);
    return () => { stop(); io.disconnect(); ro.disconnect(); redraw.current = () => undefined; };
  }, [count]);

  const num = String(index + 1).padStart(2, '0');
  return (
    <div ref={wrapRef} style={{ height: '280svh' }}>
      <section ref={sectionRef} className="sticky top-0 h-screen h-svh w-full overflow-hidden bg-black" aria-label={`Chapter ${index + 1} of ${total}: ${service.title}`}>
        <img src={m.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div ref={overlayRef} className="absolute inset-x-0 bottom-0 section pb-28 sm:pb-24" style={{ opacity: 0.35 }}>
          <p className="mb-3 text-sm text-mist">Chapter {num} of {String(total).padStart(2, '0')} · {categoryOf(service.category).label}</p>
          <h3 className="headline max-w-4xl text-[clamp(1.75rem,6vw,4rem)]">{service.title}</h3>
          <p className="mt-4 max-w-xl text-base text-white/80">{service.short}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/services/${service.slug}`} className="btn-ghost bg-ink/60">View details</Link>
            <AddToCartButton id={service.slug} />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] h-1 bg-white/10 sm:bottom-0" aria-hidden>
          <div ref={barRef} className="h-full origin-left bg-ember" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span className="absolute right-5 top-20 font-display text-sm text-white/70 sm:right-8 sm:top-24" aria-hidden>{num} / {String(total).padStart(2, '0')}</span>
      </section>
    </div>
  );
}
