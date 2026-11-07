import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadCart, saveCart, totals, type CartItem } from '../utils/cart';

interface CartCtx {
  items: CartItem[];
  has: (kind: CartItem['kind'], id: string) => boolean;
  add: (kind: CartItem['kind'], id: string) => void;
  remove: (kind: CartItem['kind'], id: string) => void;
  toggle: (kind: CartItem['kind'], id: string) => void;
  clear: () => void;
  totals: ReturnType<typeof totals>;
}
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());
  useEffect(() => saveCart(items), [items]);
  useEffect(() => {
    const onStorage = () => setItems(loadCart());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const has = useCallback((k: CartItem['kind'], id: string) => items.some((i) => i.kind === k && i.id === id), [items]);
  const add = useCallback((kind: CartItem['kind'], id: string) => setItems((p) => (p.some((i) => i.kind === kind && i.id === id) ? p : [...p, { kind, id }])), []);
  const remove = useCallback((kind: CartItem['kind'], id: string) => setItems((p) => p.filter((i) => !(i.kind === kind && i.id === id))), []);
  const toggle = useCallback((kind: CartItem['kind'], id: string) => setItems((p) => (p.some((i) => i.kind === kind && i.id === id) ? p.filter((i) => !(i.kind === kind && i.id === id)) : [...p, { kind, id }])), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, has, add, remove, toggle, clear, totals: totals(items) }), [items, has, add, remove, toggle, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
}
