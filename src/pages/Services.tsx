import { useMemo, useState } from 'react';
import { categories, services, type CategoryId } from '../data/services';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const [cat, setCat] = useState<CategoryId | 'all'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => services.filter((s) => (cat === 'all' || s.category === cat) && `${s.title} ${s.short}`.toLowerCase().includes(q.trim().toLowerCase())), [cat, q]);
  const chip = (active: boolean) => `rounded-full border px-4 py-2 text-sm min-h-[44px] ${active ? 'border-ember bg-ember text-ink' : 'border-line text-white/80 hover:border-white/50'}`;
  return (
    <main className="section pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,5rem)]">Services</h1>
      <p className="mt-4 max-w-xl text-mist">Detailing services in four categories. Prices are set by ARS; services without a listed price are quoted on request.</p>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button type="button" className={chip(cat === 'all')} aria-pressed={cat === 'all'} onClick={() => setCat('all')}>All</button>
        {categories.map((c) => <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
      </div>
      <div className="mt-4 max-w-md">
        <label htmlFor="search" className="sr-only">Search services</label>
        <input id="search" type="search" className="field" placeholder="Search services" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="mt-6 text-sm text-mist" aria-live="polite">{list.length} service{list.length === 1 ? '' : 's'}</p>
      {list.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center">
          <p className="font-semibold">No services match your search</p>
          <button type="button" className="btn-ghost mt-4" onClick={() => { setQ(''); setCat('all'); }}>Clear filters</button>
        </div>
      )}
    </main>
  );
}
