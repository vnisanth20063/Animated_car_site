import type { ReactNode } from 'react';

export default function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-mist">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="err">{error}</p>}
    </div>
  );
}
export const isMobileNumber = (v: string) => /^\+?[0-9][0-9\s-]{7,14}$/.test(v.trim());
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const validYear = (v: string) => /^\d{4}$/.test(v) && +v >= 1980 && +v <= new Date().getFullYear() + 1;
export const today = () => new Date().toISOString().slice(0, 10);
