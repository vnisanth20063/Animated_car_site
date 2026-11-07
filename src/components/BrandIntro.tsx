import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { BRAND_INTRO } from '../data/services';
import { useLiteMotion, usePrefersReducedMotion } from '../hooks/useMedia';
import { forceMuted } from '../utils/video';

const SEEN = 'ars-intro-seen';
const seenAlready = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch { return false; } };

/** Full-screen ARS brand video. Plays once per browsing session and can be skipped. */
export default function BrandIntro() {
  const reduced = usePrefersReducedMotion();
  const lite = useLiteMotion();
  const [show, setShow] = useState(() => !seenAlready());
  const [blocked, setBlocked] = useState(false); // browser refused autoplay (e.g. iPhone Low Power Mode)
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);

  const finish = useCallback(() => {
    try { sessionStorage.setItem(SEEN, '1'); } catch { /* ignore */ }
    setShow(false);
  }, []);

  useEffect(() => { if (reduced) finish(); }, [reduced, finish]);

  // Start playback explicitly: autoplay attributes alone are unreliable on phones.
  useEffect(() => {
    if (!show) return;
    const v = videoRef.current;
    if (!v) return;
    forceMuted(v);
    const tryPlay = () => v.play().then(() => { started.current = true; setBlocked(false); }).catch(() => setBlocked(true));
    if (v.readyState >= 2) tryPlay(); else v.addEventListener('loadeddata', tryPlay, { once: true });
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = 'hidden';
    // Loading fallback: nothing started and no tap prompt within 10s -> go straight to the site.
    const t = window.setTimeout(() => { if (!started.current && !blocked) finish(); }, 10000);
    // Autoplay blocked and the visitor did nothing: do not leave them waiting.
    const b = blocked ? window.setTimeout(() => { if (!started.current) finish(); }, 7000) : 0;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); if (b) window.clearTimeout(b); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [show, blocked, finish]);

  const manualPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    forceMuted(v);
    v.play().then(() => { started.current = true; setBlocked(false); }).catch(finish);
  };

  const src = lite ? `/videos/720/${BRAND_INTRO}.mp4` : `/videos/1080/${BRAND_INTRO}.mp4`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div key="intro" className="fixed inset-0 z-[100] bg-black" role="dialog" aria-label="ARS Automotive Care introduction" exit={{ opacity: 0 }} transition={{ duration: 0.7 }}>
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={src}
            poster={`/posters/${BRAND_INTRO}.jpg`}
            muted playsInline preload="auto"
            onPlaying={() => { started.current = true; setBlocked(false); }}
            onEnded={finish}
            onError={finish}
          />
          {blocked && (
            <button type="button" onClick={manualPlay} className="absolute inset-0 grid place-items-center bg-black/30" aria-label="Play intro video">
              <span className="btn-primary gap-2"><Play size={18} aria-hidden /> Tap to play</span>
            </button>
          )}
          <button type="button" onClick={finish} className="btn-ghost absolute right-5 bg-ink/70" style={{ top: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
