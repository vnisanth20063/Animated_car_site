import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { services, categoryOf, BRAND_INTRO } from '../data/services';
import { comparisons } from '../data/comparisons';
import { packages } from '../data/packages';
import ScrollVideoSection from '../components/ScrollVideoSection';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ServiceCard from '../components/ServiceCard';
import PackageCard from '../components/PackageCard';
import { useSimpleMode } from '../hooks/useMedia';

export default function Home() {
  const simple = useSimpleMode();
  const approved = packages.filter((p) => p.approved);
  const first = comparisons[0];
  return (
    <main>
      {/* 1. Cinematic introduction */}
      <section className="relative flex min-h-screen min-h-svh items-end overflow-hidden">
        <img src={`/posters/${BRAND_INTRO}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="section relative pb-28 pt-32 sm:pb-20 sm:pt-40">
          <p className="mb-4 text-sm font-medium text-ember">ARS Automotive Care</p>
          <h1 className="headline max-w-5xl text-[clamp(2.25rem,9vw,7.5rem)]">Experience the art of automotive detailing.</h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/services" className="btn-primary">Explore our services</Link>
            <Link to="/booking" className="btn-ghost">Book your service</Link>
          </div>
        </div>
      </section>

      {/* 2. Brand philosophy */}
      <section className="section py-16 sm:py-28">
        <h2 className="headline max-w-4xl text-[clamp(2rem,5.5vw,4.5rem)]">A car is more than a machine. It is a masterpiece.</h2>
        <p className="mt-8 max-w-2xl text-lg text-mist">At ARS Automotive Care, every vehicle receives attention, precision and care. From detailed cleaning to advanced surface protection and quality replacement services, we bring out the best in every vehicle.</p>
      </section>

      {/* 3. Detailing journey */}
      <section aria-labelledby="journey">
        <div className="section pb-16">
          <h2 id="journey" className="headline text-[clamp(2rem,5vw,4rem)]">Our detailing journey</h2>
          <p className="mt-4 max-w-xl text-mist">{services.length} services, one chapter each. Scroll to play each video forward; scroll back to rewind.</p>
          {!simple && <Link to="/services" className="mt-4 inline-block text-sm text-ember underline">Prefer a simple list? Browse all services</Link>}
        </div>
        {simple ? (
          <div className="section grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
          </div>
        ) : (
          services.map((s, i) => <ScrollVideoSection key={s.slug} service={s} index={i} total={services.length} />)
        )}
      </section>

      {/* 4. Before and after */}
      <section className="section py-16 sm:py-28">
        <h2 className="headline max-w-3xl text-[clamp(2rem,5vw,4rem)]">See the difference. Feel the perfection.</h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <BeforeAfterSlider before={first.before} after={first.after} title={first.title} illustrative={first.illustrative} />
          <div>
            <p className="text-sm text-mist">{categoryOf(services.find((s) => s.slug === first.serviceSlug)!.category).label}</p>
            <h3 className="mt-2 text-2xl font-semibold">{first.title}</h3>
            <p className="mt-3 max-w-md text-mist">Drag the divider to compare the vehicle before and after the service. Only matching vehicles and angles are shown.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/services/${first.serviceSlug}`} className="btn-primary">View service</Link>
              <Link to="/gallery" className="btn-ghost">Open gallery</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. OEM / OEM+ */}
      <section className="bg-charcoal py-16 sm:py-28">
        <div className="section">
          <h2 className="headline max-w-4xl text-[clamp(2rem,5vw,4rem)]">Precision replacements. Quality you can trust.</h2>
          <p className="mt-6 max-w-2xl text-mist">ARS provides vehicle component replacement services using OEM and OEM+ quality options, subject to vehicle compatibility and availability. You are booking a replacement service, not buying standalone spare parts.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-6"><h3 className="text-xl font-semibold">OEM replacement service</h3><p className="mt-2 text-sm text-mist">Original-equipment quality options, matched to your vehicle where available.</p></div>
            <div className="rounded-2xl border border-line p-6"><h3 className="text-xl font-semibold">OEM+ replacement service</h3><p className="mt-2 text-sm text-mist">Enhanced-quality options where ARS can offer them for your vehicle. Not every option suits every vehicle.</p></div>
          </div>
          <Link to="/replacement-services" className="btn-primary mt-10">Request a replacement service</Link>
        </div>
      </section>

      {/* 6. Packages */}
      <section className="section py-16 sm:py-28">
        <h2 className="headline text-[clamp(2rem,5vw,4rem)]">Service packages</h2>
        {approved.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{approved.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line p-10">
            <p className="text-lg font-semibold">Packages are being prepared</p>
            <p className="mt-2 max-w-lg text-mist">ARS will publish approved service combinations here. You can already choose individual services and request a combined quote.</p>
            <Link to="/services" className="btn-ghost mt-6">Choose services</Link>
          </div>
        )}
      </section>

      {/* 7. Final reveal */}
      <section className="relative grid min-h-[70svh] place-items-center overflow-hidden bg-black px-5 text-center">
        {site.assets.finalReveal ? (
          <video className="absolute inset-0 h-full w-full object-cover" src={site.assets.finalReveal} poster={site.assets.finalRevealPoster} muted loop playsInline autoPlay />
        ) : (
          <p className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-line px-4 py-1 text-xs text-mist">Placeholder – final reveal video not supplied</p>
        )}
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative py-24 pb-32 sm:pb-24">
          <h2 className="headline text-[clamp(2.25rem,7vw,6rem)]">Not just cleaned. Redefined.</h2>
          <p className="mt-6 font-display text-lg tracking-wide">ARS Automotive Care</p>
          <Link to="/booking" className="btn-primary mt-10">Book your transformation</Link>
        </div>
      </section>
    </main>
  );
}
