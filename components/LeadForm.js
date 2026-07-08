import { useState } from 'react';

const INTERESTS = [
  { value: 'site-visit', label: 'Schedule a site visit' },
  { value: 'callback', label: 'Request a callback' },
  { value: 'info', label: 'Ask for more information' },
];

export default function LeadForm({ property, agent }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'site-visit',
    message: '',
  });
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, propertyId: property.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="alert alert-success mb-0" role="alert">
        <h6 className="alert-heading fw-bold">
          <i className="bi bi-check-circle me-2" />
          Enquiry sent!
        </h6>
        <p className="mb-0 small">
          {agent ? agent.name : 'The listing agent'} will get back to you shortly
          on {form.phone}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Your Name *</label>
        <input
          className="form-control"
          required
          value={form.name}
          onChange={set('name')}
          placeholder="Full name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Phone *</label>
        <input
          className="form-control"
          type="tel"
          required
          value={form.phone}
          onChange={set('phone')}
          placeholder="+91 XXXXX XXXXX"
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Email</label>
        <input
          className="form-control"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">I want to…</label>
        <select className="form-select" value={form.interest} onChange={set('interest')}>
          {INTERESTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Message</label>
        <textarea
          className="form-control"
          rows={3}
          value={form.message}
          onChange={set('message')}
          placeholder={`I'm interested in "${property.title}"…`}
        />
      </div>
      {state === 'error' && (
        <div className="alert alert-danger py-2 small">{error}</div>
      )}
      <button
        className="btn btn-brand w-100 fw-semibold"
        disabled={state === 'sending'}
      >
        {state === 'sending' ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Sending…
          </>
        ) : (
          <>
            <i className="bi bi-send me-2" />
            Contact Agent
          </>
        )}
      </button>
    </form>
  );
}
