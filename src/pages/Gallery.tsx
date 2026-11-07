import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, services, media, type CategoryId } from '../data/services';
import { comparisons } from '../data/comparisons';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

export default function Gallery() {
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const catOf = (slug: string) => services.find((s) => s.slug === slug)?.category;
  const pairs = comparisons.filter((c) => cat === 'all' || catOf(c.serviceSlug) === cat);
  const clips = services.filter((s) => cat === 'all' || s.category === cat);
  const chip = (a: boolean) => `rounded-full border px-4 py-2 text-sm min-h-[44px] ${a ? 'border-ember bg-ember text-ink' : 'border-line text-white/80 hover:border-white/50'}`;
  return (
    <main className="section pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,5rem)]">Gallery</h1>
      <p className="mt-4 max-w-xl text-mist">See the difference. Feel the perfection.</p>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" className={chip(cat === 'all')} aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All</button>
        {categories.map((c) => <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
      </div>

      <h2 className="mt-14 text-2xl font-semibold">Before and after</h2>
      {pairs.length ? (
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {pairs.map((c) => (
            <figure key={c.id}>
              <BeforeAfterSlider before={c.before} after={c.after} title={c.title} illustrative={c.illustrative} />
              <figcaption className="mt-3 flex items-center justify-between text-sm"><span>{c.title}{c.vehicle ? ` · ${c.vehicle}` : ''}</span><Link className="text-ember underline" to={`/services/${c.serviceSlug}`}>View service</Link></figcaption>
            </figure>
          ))}
        </div>
      ) : <p className="mt-4 text-mist">No comparisons in this category yet.</p>}

      <h2 className="mt-16 text-2xl font-semibold">Service films</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clips.map((s) => (
          <Link key={s.slug} to={`/services/${s.slug}`} className="group relative block aspect-video overflow-hidden rounded-xl border border-line">
            <img src={media(s.slug).poster} alt="" loading="lazy" width={1280} height={720} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4 text-sm font-medium">{s.title}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
