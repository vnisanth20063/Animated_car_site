import { Link } from 'react-router-dom';
import { bySlug } from '../data/services';
import { packagePrices } from '../data/pricing';
import type { Package } from '../data/packages';
import Price from './Price';
import AddToCartButton from './AddToCartButton';

export default function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-charcoal p-6">
      {!pkg.approved && <span className="mb-3 w-fit rounded-full border border-ember px-3 py-1 text-xs text-ember">Draft – not approved by ARS</span>}
      <h3 className="text-2xl font-semibold">{pkg.name}</h3>
      <p className="mt-2 text-sm text-mist">{pkg.description}</p>
      <ul className="mt-5 space-y-2 text-sm">
        {pkg.includes.map((slug) => {
          const s = bySlug(slug);
          return s ? <li key={slug}><Link className="hover:text-ember" to={`/services/${slug}`}>{s.title}</Link></li> : null;
        })}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <Price value={packagePrices[pkg.id]} />
        <AddToCartButton kind="package" id={pkg.id} compact />
      </div>
    </article>
  );
}
