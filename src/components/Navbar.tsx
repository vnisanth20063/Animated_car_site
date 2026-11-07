import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/replacement-services', label: 'OEM & OEM+' },
  { to: '/packages', label: 'Packages' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-baseline gap-2" aria-label="ARS Automotive Care home">
      <span className="font-display text-2xl font-extrabold tracking-tight">ARS</span>
      <span className="hidden text-[11px] font-medium text-mist sm:inline">Automotive Care</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const { pathname } = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const link = ({ isActive }: { isActive: boolean }) => `text-sm transition-colors ${isActive ? 'text-ember' : 'text-white/80 hover:text-white'}`;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 sm:bg-ink/80 sm:backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="section flex h-16 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {navLinks.map((l) => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={link}>{l.label}</NavLink>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label={`Cart, ${items.length} item${items.length === 1 ? '' : 's'}`}>
              <ShoppingCart size={20} aria-hidden />
              {items.length > 0 && <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-ink">{items.length}</span>}
            </Link>
            <Link to="/booking" className="btn-primary hidden !py-2 sm:inline-flex">Book now</Link>
            <button ref={menuBtn} type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10 lg:hidden" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink p-5 lg:hidden" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center justify-between">
            <Logo />
            <button ref={closeRef} type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Close menu" onClick={() => { setOpen(false); menuBtn.current?.focus(); }}>
              <X size={22} aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-8 flex flex-1 flex-col">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `border-b border-line py-4 font-display text-2xl font-semibold ${isActive ? 'text-ember' : ''}`}>{l.label}</NavLink>
            ))}
          </nav>
          <Link to="/booking" className="btn-primary mt-6 w-full">Book your service</Link>
        </div>
      )}
    </>
  );
}
