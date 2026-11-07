import { Link } from 'react-router-dom';
import { media, categoryOf, type Service } from '../data/services';
import { servicePrices } from '../data/pricing';
import Price from './Price';
import AddToCartButton from './AddToCartButton';

export default function ServiceCard({ service }: { service: Service }) {
  const m = media(service.slug);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-charcoal">
      <Link to={`/services/${service.slug}`} className="relative block aspect-video overflow-hidden bg-black" aria-label={`View details: ${service.title}`}>
        <img src={m.poster} alt="" width={1280} height={720} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs text-mist">{categoryOf(service.category).label}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug">{service.title}</h3>
        <p className="text-sm text-mist">{service.short}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <Price value={servicePrices[service.slug]} className="text-sm" />
          <div className="flex flex-wrap gap-2">
            <Link to={`/services/${service.slug}`} className="btn-ghost !px-4 !py-2">View details</Link>
            <AddToCartButton id={service.slug} compact />
          </div>
        </div>
      </div>
    </article>
  );
}
