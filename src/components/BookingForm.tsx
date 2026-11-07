import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { services } from '../data/services';
import { vehicleBrands } from '../data/site';
import { submitRequest, type SubmitResult } from '../utils/submit';
import Field, { isEmail, isMobileNumber, today, validYear } from './Field';
import { itemTitle } from './CartSummary';

const times = ['Morning (9am – 12pm)', 'Afternoon (12pm – 4pm)', 'Evening (4pm – 7pm)'];
type Errors = Record<string, string>;

export default function BookingForm() {
  const { items, add, remove, clear } = useCart();
  const [f, setF] = useState({ name: '', mobile: '', email: '', brand: '', model: '', year: '', date: '', time: '', notes: '', component: '', oem: '', compat: '' });
  const [replacement, setReplacement] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [done, setDone] = useState<null | { result: SubmitResult; snapshot: typeof f; lines: string[] }>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const packagesInCart = items.filter((i) => i.kind === 'package');

  const validate = () => {
    const e: Errors = {};
    if (f.name.trim().length < 2) e.name = 'Enter your name.';
    if (!isMobileNumber(f.mobile)) e.mobile = 'Enter a valid mobile number.';
    if (f.email && !isEmail(f.email)) e.email = 'Enter a valid email or leave it empty.';
    if (!f.brand) e.brand = 'Select a vehicle brand.';
    if (!f.model.trim()) e.model = 'Enter the vehicle model.';
    if (!validYear(f.year)) e.year = 'Enter a four-digit year.';
    if (items.length === 0 && !replacement) e.items = 'Add at least one service or package.';
    if (!f.date) e.date = 'Choose a preferred date.'; else if (f.date < today()) e.date = 'Choose today or a later date.';
    if (!f.time) e.time = 'Choose a preferred time.';
    if (replacement) {
      if (!f.component.trim()) e.component = 'Enter the required component.';
      if (!f.oem) e.oem = 'Choose OEM or OEM+.';
    }
    setErrors(e);
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setFailure('');
    const e = validate();
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[role="alert"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
      return;
    }
    setBusy(true);
    try {
      const lines = items.map(itemTitle);
      const result = await submitRequest('booking', { ...f, replacement, services: items });
      setDone({ result, snapshot: f, lines });
      clear();
    } catch (err) {
      setFailure(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  if (done) {
    const s = done.snapshot;
    return (
      <div className="rounded-2xl border border-line bg-charcoal p-8" aria-live="polite">
        <CheckCircle2 className="text-ember" size={36} aria-hidden />
        <h2 className="headline mt-4 text-3xl">Booking request received</h2>
        <p className="mt-3 max-w-xl text-mist">ARS will contact you to confirm availability and pricing. This is a request only – no appointment is confirmed yet.</p>
        {!done.result.sent && <p className="mt-3 max-w-xl rounded-lg border border-ember/50 p-3 text-sm text-ember">Demo mode: no server is connected, so this request is saved on this device only and has not been sent to ARS.</p>}
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-mist">Reference</dt><dd>{done.result.reference}</dd></div>
          <div><dt className="text-mist">Name</dt><dd>{s.name}</dd></div>
          <div><dt className="text-mist">Mobile</dt><dd>{s.mobile}</dd></div>
          {s.email && <div><dt className="text-mist">Email</dt><dd>{s.email}</dd></div>}
          <div><dt className="text-mist">Vehicle</dt><dd>{s.brand} {s.model} ({s.year})</dd></div>
          <div><dt className="text-mist">Preferred slot</dt><dd>{s.date}, {s.time}</dd></div>
          <div className="sm:col-span-2"><dt className="text-mist">Selected services</dt><dd>{done.lines.length ? done.lines.join(', ') : 'None selected'}</dd></div>
          {replacement && <div className="sm:col-span-2"><dt className="text-mist">Replacement enquiry</dt><dd>{s.component} – {s.oem}</dd></div>}
        </dl>
        <Link to="/services" className="btn-ghost mt-8">Back to services</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-8">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold">Your details</legend>
        <Field id="name" label="Customer name" error={errors.name}><input id="name" className="field" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!errors.name} /></Field>
        <Field id="mobile" label="Mobile number" error={errors.mobile}><input id="mobile" className="field" type="tel" inputMode="tel" autoComplete="tel" value={f.mobile} onChange={set('mobile')} aria-invalid={!!errors.mobile} /></Field>
        <Field id="email" label="Email (optional)" error={errors.email}><input id="email" className="field" type="email" autoComplete="email" value={f.email} onChange={set('email')} aria-invalid={!!errors.email} /></Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-3">
        <legend className="mb-4 font-display text-xl font-semibold">Vehicle</legend>
        <Field id="brand" label="Brand" error={errors.brand}>
          <select id="brand" className="field" value={f.brand} onChange={set('brand')}><option value="">Select brand</option>{vehicleBrands.map((b) => <option key={b}>{b}</option>)}</select>
        </Field>
        <Field id="model" label="Model" error={errors.model}><input id="model" className="field" value={f.model} onChange={set('model')} /></Field>
        <Field id="year" label="Year" error={errors.year}><input id="year" className="field" inputMode="numeric" maxLength={4} value={f.year} onChange={set('year')} /></Field>
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-display text-xl font-semibold">Selected services</legend>
        {items.length === 0 ? <p className="text-sm text-mist">Nothing selected yet.</p> : (
          <ul className="flex flex-wrap gap-2">{items.map((i) => (
            <li key={`${i.kind}-${i.id}`} className="flex items-center gap-2 rounded-full border border-line bg-charcoal py-1 pl-4 pr-1 text-sm">
              {itemTitle(i)}
              <button type="button" onClick={() => remove(i.kind, i.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label={`Remove ${itemTitle(i)}`}>×</button>
            </li>))}</ul>
        )}
        {packagesInCart.length > 0 && <p className="mt-2 text-xs text-mist">Selected package: {packagesInCart.map(itemTitle).join(', ')}</p>}
        <label htmlFor="addsvc" className="sr-only">Add a service</label>
        <select id="addsvc" className="field mt-4 sm:max-w-md" value="" onChange={(e) => e.target.value && add('service', e.target.value)}>
          <option value="">Add another service…</option>
          {services.filter((s) => !items.some((i) => i.kind === 'service' && i.id === s.slug)).map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
        {errors.items && <p role="alert" className="err">{errors.items}</p>}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-xl font-semibold">Preferred appointment</legend>
        <Field id="date" label="Date" error={errors.date}><input id="date" className="field" type="date" min={today()} value={f.date} onChange={set('date')} /></Field>
        <Field id="time" label="Time" error={errors.time}>
          <select id="time" className="field" value={f.time} onChange={set('time')}><option value="">Select time</option>{times.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
      </fieldset>

      <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#FF672F]" checked={replacement} onChange={(e) => setReplacement(e.target.checked)} /> I also need an OEM / OEM+ replacement service</label>
      {replacement && (
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-display text-xl font-semibold">Replacement enquiry</legend>
          <Field id="component" label="Required component" error={errors.component}><input id="component" className="field" value={f.component} onChange={set('component')} /></Field>
          <Field id="oem" label="Preference" error={errors.oem}>
            <select id="oem" className="field" value={f.oem} onChange={set('oem')}><option value="">Select</option><option>OEM</option><option>OEM+</option></select>
          </Field>
          <div className="sm:col-span-2"><Field id="compat" label="Vehicle compatibility details" hint="Variant, engine, VIN or part number if you have it."><textarea id="compat" rows={3} className="field" value={f.compat} onChange={set('compat')} /></Field></div>
        </fieldset>
      )}

      <Field id="notes" label="Additional instructions"><textarea id="notes" rows={4} className="field" value={f.notes} onChange={set('notes')} /></Field>

      {failure && <p role="alert" className="err">{failure}</p>}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send booking request'}</button>
      <p className="text-xs text-mist">Sending a request does not confirm an appointment. ARS will contact you to confirm availability and pricing.</p>
    </form>
  );
}
