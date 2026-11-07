import CartSummary from '../components/CartSummary';

export default function Cart() {
  return (
    <main className="section max-w-3xl pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,4rem)]">Your cart</h1>
      <p className="mb-8 mt-3 text-mist">Services you have selected. Your cart is saved on this device.</p>
      <CartSummary />
    </main>
  );
}
