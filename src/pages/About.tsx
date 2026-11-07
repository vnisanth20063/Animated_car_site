import { Link } from 'react-router-dom';
import { site } from '../data/site';

export default function About() {
  return (
    <main className="section pb-10 pt-32">
      <h1 className="headline max-w-4xl text-[clamp(2rem,6vw,5rem)]">{site.tagline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/80">{site.supporting} At ARS Automotive Care, every vehicle receives attention, precision and care. From detailed cleaning to advanced surface protection and quality replacement services, we bring out the best in every vehicle.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[['Precision', 'Detail work with the right tools for each surface.'], ['Care', 'Each vehicle is treated as a masterpiece, not a number.'], ['Trust', 'Prices, availability and compatibility are confirmed with you before work begins.']].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-line bg-charcoal p-6"><h2 className="text-xl font-semibold">{t}</h2><p className="mt-2 text-sm text-mist">{d}</p></div>
        ))}
      </div>
      <Link to="/services" className="btn-primary mt-12">Explore our services</Link>
    </main>
  );
}
