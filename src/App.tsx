import { Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BrandIntro from './components/BrandIntro';
import SmoothScroll from './components/SmoothScroll';
import StickyBookCta from './components/StickyBookCta';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import ReplacementServices from './pages/ReplacementServices';
import Packages from './pages/Packages';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Booking from './pages/Booking';

function NotFound() {
  return (
    <main className="section pt-40 text-center"><h1 className="headline text-5xl">Page not found</h1>
      <p className="mt-4 text-mist">That page does not exist.</p><Link to="/" className="btn-primary mt-8">Back to home</Link></main>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded focus:bg-ember focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <BrandIntro />
      <SmoothScroll />
      <Navbar />
      <div id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/replacement-services" element={<ReplacementServices />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <StickyBookCta />
    </>
  );
}
