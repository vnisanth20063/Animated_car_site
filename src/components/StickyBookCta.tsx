import { Link, useLocation } from 'react-router-dom';

/** Mobile-only booking bar. Hidden on pages where it would be redundant. */
export default function StickyBookCta() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/booking') || pathname.startsWith('/cart')) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 p-3 backdrop-blur-md sm:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
      <Link to="/booking" className="btn-primary w-full">Book your service</Link>
    </div>
  );
}
