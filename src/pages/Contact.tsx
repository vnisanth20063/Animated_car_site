import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import Field, { isMobileNumber } from '../components/Field';
import { submitRequest, type SubmitResult } from '../utils/submit';

export default function Contact() {
  const c = site.contact;
  const [f, setF] = useState({ name: '', mobile: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [res, setRes] = useState<SubmitResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const has = c.phone || c.whatsapp || c.email || c.address || c.hours;

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = 'Enter your name.';
    if (!isMobileNumber(f.mobile)) e.mobile = 'Enter a valid mobile number.';
    if (f.message.trim().length < 5) e.message = 'Write a short message.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true); setFail('');
    try { setRes(await submitRequest('contact', f)); } catch (err) { setFail(err instanceof Error ? err.message : 'Something went wrong.'); } finally { setBusy(false); }
  };

  return (
    <main className="section pb-10 pt-32">
      <h1 className="headline text-[clamp(2rem,6vw,5rem)]">Contact</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div>
          {has ? (
            <ul className="space-y-3 text-lg">
              {c.phone && <li><a className="hover:text-ember" href={`tel:${c.phone}`}>{c.phone}</a></li>}
              {c.whatsapp && <li>WhatsApp: {c.whatsapp}</li>}
              {c.email && <li><a className="hover:text-ember" href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.address && <li>{c.address}</li>}
              {c.hours && <li className="text-mist">{c.hours}</li>}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-6">
              <p className="font-semibold">Contact details to be added</p>
              <p className="mt-2 text-sm text-mist">ARS has not supplied a phone number, email or address yet. Set them in <code>src/data/site.ts</code>.</p>
            </div>
          )}
          <p className="mt-6 text-sm text-mist">Ready to book? <Link to="/booking" className="text-ember underline">Send a booking request</Link>.</p>
        </div>
        {res ? (
          <div className="rounded-2xl border border-line bg-charcoal p-6" aria-live="polite">
            <h2 className="text-xl font-semibold">Message received</h2>
            <p className="mt-2 text-mist">Reference {res.reference}. ARS will get back to you.</p>
            {!res.sent && <p className="mt-3 rounded-lg border border-ember/50 p-3 text-sm text-ember">Demo mode: no server is connected, so this message is saved on this device only.</p>}
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5">
            <Field id="c-name" label="Name" error={errors.name}><input id="c-name" className="field" autoComplete="name" value={f.name} onChange={set('name')} /></Field>
            <Field id="c-mob" label="Mobile number" error={errors.mobile}><input id="c-mob" className="field" type="tel" autoComplete="tel" value={f.mobile} onChange={set('mobile')} /></Field>
            <Field id="c-msg" label="Message" error={errors.message}><textarea id="c-msg" rows={5} className="field" value={f.message} onChange={set('message')} /></Field>
            {fail && <p role="alert" className="err">{fail}</p>}
            <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
          </form>
        )}
      </div>
    </main>
  );
}
