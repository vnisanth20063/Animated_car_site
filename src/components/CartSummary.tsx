import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { bySlug } from '../data/services';
import { packages } from '../data/packages';
import { priceOf, formatPrice, type CartItem } from '../utils/cart';
import Price from './Price';

export function itemTitle(i: CartItem) {
  return i.kind === 'service' ? bySlug(i.id)?.title ?? i.id : packages.find((p) => p.id === i.id)?.name ?? i.id;
}

export default function CartSummary({ showActions = true }: { showActions?: boolean }) {
  const { items, remove, clear, totals } = useCart();
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-charcoal p-8 text-center">
        <p className="text-lg font-semibold">Your cart is empty</p>
        <p className="mt-2 text-sm text-mist">Add detailing services to build a booking request.</p>
        <Link to="/services" className="btn-primary mt-6">Browse services</Link>
      </div>
    );
  }
  const row = (i: CartItem) => (
    <li key={`${i.kind}-${i.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line py-4 last:border-0">
      <div>
        <p className="font-medium">{itemTitle(i)}</p>
        <p className="text-xs text-mist">{i.kind === 'package' ? 'Package' : 'Service'}</p>
      </div>
      <div className="flex items-center gap-3">
        <Price value={priceOf(i)} className="text-sm" />
        <button type="button" onClick={() => remove(i.kind, i.id)} className="grid h-10 w-10 place-items-center rounded-full text-mist hover:bg-white/10 hover:text-white" aria-label={`Remove ${itemTitle(i)}`}><Trash2 size={18} aria-hidden /></button>
      </div>
    </li>
  );
  return (
    <div className="rounded-2xl border border-line bg-charcoal p-6">
      {totals.priced.length > 0 && (<><h2 className="text-sm font-semibold text-mist">Priced items</h2><ul>{totals.priced.map(row)}</ul></>)}
      {totals.quote.length > 0 && (<><h2 className="mt-6 text-sm font-semibold text-mist">Quote required</h2><ul>{totals.quote.map(row)}</ul></>)}
      {totals.priced.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4"><span>Subtotal (priced items)</span><span className="text-xl font-semibold">{formatPrice(totals.subtotal)}</span></div>
      )}
      <p className="mt-3 text-xs text-mist">Final pricing and availability are confirmed by ARS after your booking request.</p>
      {showActions && (
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/booking" className="btn-primary">Continue to booking request</Link>
          <Link to="/services" className="btn-ghost">Continue browsing</Link>
          <button type="button" onClick={clear} className="btn-quiet">Clear cart</button>
        </div>
      )}
    </div>
  );
}
