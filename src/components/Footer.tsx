import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { Logo, navLinks } from './Navbar';

export default function Footer() {
  const c = site.contact;
  return (
    <footer className="mt-24 border-t border-line bg-charcoal pb-24 pt-14 sm:pb-14">
      <div className="section grid gap-10 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-mist">{site.supporting}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {navLinks.map((l) => <Link key={l.to} to={l.to} className="text-mist hover:text-white">{l.label}</Link>)}
          <Link to="/cart" className="text-mist hover:text-white">Cart</Link>
          <Link to="/booking" className="text-mist hover:text-white">Booking request</Link>
        </nav>
        <div className="text-sm text-mist">
          <p className="mb-2 font-medium text-white">Contact</p>
          {c.phone || c.email || c.address ? (
            <ul className="space-y-1">
              {c.phone && <li>{c.phone}</li>}
              {c.email && <li>{c.email}</li>}
              {c.address && <li>{c.address}</li>}
            </ul>
          ) : (
            <p>Contact details will be added by ARS. <Link to="/contact" className="text-ember underline">Contact page</Link></p>
          )}
        </div>
      </div>
      <p className="section mt-10 text-xs text-mist">© {new Date().getFullYear()} {site.name}. Prices and availability are confirmed by ARS.</p>
    </footer>
  );
}
