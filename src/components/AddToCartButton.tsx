import { Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Props { kind?: 'service' | 'package'; id: string; className?: string; compact?: boolean }

export default function AddToCartButton({ kind = 'service', id, className = '', compact }: Props) {
  const { has, toggle } = useCart();
  const inCart = has(kind, id);
  return (
    <button
      type="button"
      onClick={() => toggle(kind, id)}
      aria-pressed={inCart}
      className={`${inCart ? 'btn-ghost !border-ember !text-ember' : 'btn-primary'} ${compact ? '!px-4 !py-2' : ''} ${className}`}
    >
      {inCart ? <Check size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
      {inCart ? 'Added – remove' : 'Add to cart'}
    </button>
  );
}
