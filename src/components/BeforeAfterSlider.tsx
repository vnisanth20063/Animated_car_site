import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

interface Props { before?: string; after?: string; title: string; className?: string; illustrative?: boolean }

/** Draggable comparison: Before on the left, After on the right. Missing images show labelled placeholders. */
export default function BeforeAfterSlider({ before, after, title, className = '', illustrative }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const placeholder = !before || !after;

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);
  const down = (e: PointerEvent<HTMLDivElement>) => { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); };
  const drag = (e: PointerEvent<HTMLDivElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e.clientX); };
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
  };

  const Panel = ({ src, label, tone }: { src?: string; label: string; tone: string }) =>
    src ? <img src={src} alt={`${label}: ${title}`} draggable={false} className="h-full w-full select-none object-cover" />
        : <div className={`grid h-full w-full place-items-center ${tone} text-center`}><div><p className="font-display text-lg font-semibold">{label}</p><p className="mt-1 text-xs text-mist">Placeholder – image not supplied</p></div></div>;

  return (
    <div
      ref={box}
      role="slider" tabIndex={0} aria-label={`Before and after comparison: ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
      onPointerDown={down} onPointerMove={drag} onKeyDown={key}
      className={`relative aspect-[16/15] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-line bg-charcoal ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0"><Panel src={before} label="Before" tone="bg-[#1b1b1b]" /></div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><Panel src={after} label="After" tone="bg-[#2a1a14]" /></div>
      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-ink">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-ink text-xs font-bold" aria-hidden>⇆</span>
      </div>
      {!placeholder && illustrative && <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-3 py-1 text-[11px] text-mist">Illustrative image – not an actual ARS job</span>}
      {placeholder && <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-[11px] text-mist">Sample layout – not an ARS result</span>}
    </div>
  );
}
