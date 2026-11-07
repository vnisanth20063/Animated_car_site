import { servicePrices, packagePrices } from '../data/pricing';
import { site } from '../data/site';

export type CartItem = { kind: 'service' | 'package'; id: string };
const KEY = 'ars-cart-v1';

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.id === 'string' && (i.kind === 'service' || i.kind === 'package')) : [];
  } catch {
    return [];
  }
}
export function saveCart(items: CartItem[]) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable: cart still works in memory */ }
}
export const priceOf = (item: CartItem): number | null =>
  (item.kind === 'service' ? servicePrices[item.id] : packagePrices[item.id]) ?? null;

export function totals(items: CartItem[]) {
  const priced = items.filter((i) => priceOf(i) !== null);
  const quote = items.filter((i) => priceOf(i) === null);
  const subtotal = priced.reduce((sum, i) => sum + (priceOf(i) as number), 0);
  return { priced, quote, subtotal };
}
export const formatPrice = (n: number | null | undefined) =>
  n === null || n === undefined ? 'Request a quote' : `${site.currency}${n.toLocaleString('en-IN')}`;
