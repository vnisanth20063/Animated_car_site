import { formatPrice } from '../utils/cart';

export default function Price({ value, className = '' }: { value: number | null | undefined; className?: string }) {
  const quote = value === null || value === undefined;
  return <span className={`${quote ? 'text-mist' : 'text-white font-semibold'} ${className}`}>{formatPrice(value)}</span>;
}
