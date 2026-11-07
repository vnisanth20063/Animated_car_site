import { useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { vehicleBrands } from '../data/site';
import { submitRequest, type SubmitResult } from '../utils/submit';
import Field, { isMobileNumber, validYear } from './Field';

export default function ReplacementForm() {
  const [f, setF] = useState({ brand: '', model: '', year: '', component: '', pref: '', details: '', name: '', mobile: '' });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => setFiles(Array.from(e.target.files ?? []).slice(0, 4));

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!f.brand) e.brand = 'Select a vehicle brand.';
    if (!f.model.trim()) e.model = 'Enter the model.';
    if (!validYear(f.year)) e.year = 'Enter a four-digit year.';
    if (!f.component.trim()) e.component = 'Describe the component or replacement.';
    if (!f.pref) e.pref = 'Choose OEM or OEM+.';
    if (f.name.trim().length < 2) e.name = 'Enter your name.';
    if (!isMobileNumber(f.mobile)) e.mobile = 'Enter a valid mobile number.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true); setFailure('');
    try { setResult(await submitRequest('replacement-enquiry', { ...f, attachments: files.map((x) => x.name) })); }
    catch (err) { setFailure(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setBusy(false); }
  };

  if (result) {
    return (
      <div className="rounded-2xl border border-line bg-charcoal p-8" aria-live="polite">
        <CheckCircle2 className="text-ember" size={32} aria-hidden />
        <h3 className="mt-3 text-2xl font-semibold">Enquiry received</h3>
        <p className="mt-2 text-mist">Reference {result.reference}. ARS will confirm compatibility, availability and a quote. Nothing is confirmed yet.</p>
        {!result.sent && <p className="mt-3 rounded-lg border border-ember/50 p-3 text-sm text-ember">Demo mode: no server is connected, so this enquiry is saved on this device only.</p>}
      </div>
    );
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id="r-brand" label="Vehicle brand" error={errors.brand}>
        <select id="r-brand" className="field" value={f.brand} onChange={set('brand')}><option value="">Select brand</option>{vehicleBrands.map((b) => <option key={b}>{b}</option>)}</select>
      </Field>
      <Field id="r-model" label="Model" error={errors.model}><input id="r-model" className="field" value={f.model} onChange={set('model')} /></Field>
      <Field id="r-year" label="Manufacturing year" error={errors.year}><input id="r-year" className="field" inputMode="numeric" maxLength={4} value={f.year} onChange={set('year')} /></Field>
      <Field id="r-pref" label="Preference" error={errors.pref}>
        <select id="r-pref" className="field" value={f.pref} onChange={set('pref')}><option value="">Select</option><option>OEM</option><option>OEM+</option></select>
      </Field>
      <div className="sm:col-span-2"><Field id="r-comp" label="Component or replacement required" error={errors.component}><input id="r-comp" className="field" value={f.component} onChange={set('component')} /></Field></div>
      <div className="sm:col-span-2"><Field id="r-det" label="Supporting details" hint="Variant, part number or anything that helps ARS check compatibility."><textarea id="r-det" rows={3} className="field" value={f.details} onChange={set('details')} /></Field></div>
      <div className="sm:col-span-2">
        <Field id="r-img" label="Photos (optional, up to 4)" hint={files.length ? `${files.length} selected. Photos are only sent when a server endpoint is connected.` : undefined}>
          <input id="r-img" type="file" accept="image/*" multiple onChange={onFiles} className="field file:mr-4 file:rounded-full file:border-0 file:bg-ember file:px-4 file:py-1.5 file:text-ink" />
        </Field>
      </div>
      <Field id="r-name" label="Your name" error={errors.name}><input id="r-name" className="field" autoComplete="name" value={f.name} onChange={set('name')} /></Field>
      <Field id="r-mob" label="Mobile number" error={errors.mobile}><input id="r-mob" className="field" type="tel" autoComplete="tel" value={f.mobile} onChange={set('mobile')} /></Field>
      {failure && <p role="alert" className="err sm:col-span-2">{failure}</p>}
      <div className="sm:col-span-2"><button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Request a replacement service'}</button></div>
    </form>
  );
}
