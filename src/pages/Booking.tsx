import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { useCart } from '../context/CartContext';
import { bySlug } from '../data/services';

export default function Booking() {
  const [params] = useSearchParams();
  const { add } = useCart();
  const preselect = params.get('service');
  useEffect(() => { if (preselect && bySlug(preselect)) add('service', preselect); }, [preselect, add]);
  return (
    <main className="section max-w-3xl pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,4rem)]">Booking request</h1>
      <p className="mb-10 mt-3 text-mist">Tell us about your vehicle and preferred time. ARS will contact you to confirm availability and pricing – a request is not a confirmed appointment.</p>
      <BookingForm />
    </main>
  );
}
