// Frontend-only submission. With VITE_FORM_ENDPOINT set, the request is POSTed as JSON.
// Without it, the request is stored on this device only and the UI says so.
export interface SubmitResult { sent: boolean; reference: string }

export async function submitRequest(kind: string, payload: Record<string, unknown>): Promise<SubmitResult> {
  const reference = `ARS-${Date.now().toString(36).toUpperCase()}`;
  const body = { kind, reference, submittedAt: new Date().toISOString(), ...payload };
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  if (endpoint) {
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('The request could not be sent. Please try again.');
    return { sent: true, reference };
  }
  try {
    const list = JSON.parse(localStorage.getItem('ars-requests') || '[]');
    list.push(body);
    localStorage.setItem('ars-requests', JSON.stringify(list));
  } catch { /* ignore */ }
  return { sent: false, reference };
}
