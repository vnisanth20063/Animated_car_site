import { Link, useNavigate, useParams } from 'react-router-dom';
import { bySlug, categoryOf, services } from '../data/services';
import { servicePrices } from '../data/pricing';
import { comparisons } from '../data/comparisons';
import { useCart } from '../context/CartContext';
import SmartVideo from '../components/SmartVideo';
import Price from '../components/Price';
import AddToCartButton from '../components/AddToCartButton';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ServiceCard from '../components/ServiceCard';

export default function ServiceDetails() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { add } = useCart();
  const s = bySlug(slug);
  if (!s) {
    return <main className="section pt-40 text-center"><h1 className="headline text-4xl">Service not found</h1><Link to="/services" className="btn-primary mt-8">Browse services</Link></main>;
  }
  const cat = categoryOf(s.category);
  const real = comparisons.filter((c) => c.serviceSlug === s.slug && c.before && c.after);
  const related = services.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 3);
  const fallback = related.length ? related : services.filter((x) => x.slug !== s.slug).slice(0, 3);
  return (
    <main className="pb-10 pt-24">
      <div className="section">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-mist"><Link to="/services" className="hover:text-white">Services</Link> / {cat.label}</nav>
        <div className="overflow-hidden rounded-2xl border border-line bg-black"><SmartVideo key={s.slug} slug={s.slug} className="aspect-video w-full object-cover" /></div>
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div>
            <h1 className="headline text-[clamp(2rem,5vw,4rem)]">{s.title}</h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">{s.description}</p>
            <h2 className="mt-12 text-xl font-semibold">Benefits</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
            <h2 className="mt-12 text-xl font-semibold">Process</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-white/80">{s.process.map((p) => <li key={p}>{p}</li>)}</ol>
            <p className="mt-3 text-xs text-mist">Steps are indicative. ARS confirms the exact process for your vehicle.</p>
            <h2 className="mt-12 text-xl font-semibold">Suitable vehicles</h2>
            <p className="mt-2 text-white/80">Suitability is confirmed by ARS when you book.</p>
          </div>
          <aside className="order-first h-fit rounded-2xl border border-line bg-charcoal p-6 lg:order-none lg:sticky lg:top-24">
            <p className="text-sm text-mist">Price</p>
            <Price value={servicePrices[s.slug]} className="text-2xl" />
            <div className="mt-6 flex flex-col gap-3">
              <AddToCartButton id={s.slug} />
              <button type="button" className="btn-ghost" onClick={() => { add('service', s.slug); nav('/booking'); }}>Book this service</button>
            </div>
            <p className="mt-4 text-xs text-mist">Final pricing and availability are confirmed by ARS.</p>
          </aside>
        </div>

        <h2 className="mt-16 text-xl font-semibold">Before and after</h2>
        {real.length ? (
          <div className="mt-4 grid gap-6 md:grid-cols-2">{real.map((c) => <BeforeAfterSlider key={c.id} before={c.before} after={c.after} title={c.title} illustrative={c.illustrative} />)}</div>
        ) : (
          <p className="mt-2 text-mist">Before-and-after images for this service will be added once ARS supplies them.</p>
        )}

        <h2 className="mt-16 text-xl font-semibold">Related services</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{fallback.map((x) => <ServiceCard key={x.slug} service={x} />)}</div>
      </div>
    </main>
  );
}
