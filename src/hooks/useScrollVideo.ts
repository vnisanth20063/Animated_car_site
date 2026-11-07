import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Opts {
  sectionRef: RefObject<HTMLElement>;
  videoRef: RefObject<HTMLVideoElement>;
  overlayRef: RefObject<HTMLElement>;
  barRef: RefObject<HTMLElement>;
  enabled: boolean;
  /** pinned scroll distance as a multiple of the viewport height */
  length?: number;
}

/**
 * Pins the section and maps scroll progress to video.currentTime.
 * Scrolling down plays forward, scrolling up reverses, and the video holds on
 * its first / last frame at the section boundaries.
 */
export function useScrollVideo({ sectionRef, videoRef, overlayRef, barRef, enabled, length = 1.7 }: Opts) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!enabled || !section || !video) return;
    gsap.registerPlugin(ScrollTrigger);

    let target = 0;
    let current = 0;
    let raf = 0;
    let duration = isFinite(video.duration) && video.duration > 0 ? video.duration : 9.96;

    const onMeta = () => {
      if (isFinite(video.duration) && video.duration > 0) duration = video.duration;
      ScrollTrigger.refresh();
    };
    // iOS/Safari only allows seeking after the media has been "touched" once.
    const unlock = () => {
      video.play().then(() => video.pause()).catch(() => undefined);
    };
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', unlock, { once: true });
    video.pause();

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.004) current = target;
      if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - current) > 0.015) {
        video.currentTime = current;
      }
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * length)}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => (self.isActive ? start() : stop()),
        onUpdate: (self) => {
          const p = self.progress;
          target = p * duration;
          if (overlayRef.current) overlayRef.current.style.opacity = String(Math.max(0, Math.min(1, p / 0.08, (1 - p) / 0.08)));
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        },
        onLeave: () => { target = duration; current = duration; if (video.readyState >= 2) video.currentTime = duration; },
        onLeaveBack: () => { target = 0; current = 0; if (video.readyState >= 2) video.currentTime = 0; },
      });
    }, section);

    return () => {
      stop();
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', unlock);
      ctx.revert();
    };
  }, [enabled, length, sectionRef, videoRef, overlayRef, barRef]);
}
