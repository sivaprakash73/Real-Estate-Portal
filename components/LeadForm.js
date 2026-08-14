import { useState } from 'react';

const INTERESTS = [
  { value: 'site-visit', label: 'Schedule a site visit' },
  { value: 'callback', label: 'Request a callback' },
  { value: 'info', label: 'Ask for more information' },
];

export default function LeadForm({ property, agent, defaultInterest = 'site-visit', showDate = false, compact = false }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: defaultInterest,
    visitDate: '',
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
    <form onSubmit={submit} className={compact ? 'row g-3' : ''}>
      <div className={compact ? 'col-md-6' : 'mb-3'}>
        <label className="form-label small fw-semibold">Your name *</label>
        <input
          className="form-control"
          required
          value={form.name}
          onChange={set('name')}
          placeholder="Full name"
        />
      </div>
      <div className={compact ? 'col-md-6' : 'mb-3'}>
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
      <div className={compact ? 'col-md-6' : 'mb-3'}>
        <label className="form-label small fw-semibold">Email</label>
        <input
          className="form-control"
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
        />
      </div>
      <div className={compact ? 'col-md-6' : 'mb-3'}>
        <label className="form-label small fw-semibold">I want to…</label>
        <select className="form-select" value={form.interest} onChange={set('interest')}>
          {INTERESTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      {showDate && (
        <div className={compact ? 'col-md-6' : 'mb-3'}>
          <label className="form-label small fw-semibold">Preferred visit date</label>
          <input
            className="form-control"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={form.visitDate}
            onChange={set('visitDate')}
          />
        </div>
      )}
      <div className={compact ? 'col-12' : 'mb-3'}>
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
        <div className={`alert alert-danger py-2 small ${compact ? 'col-12 mb-0' : ''}`}>{error}</div>
      )}
      <button
        className={`btn btn-brand fw-semibold ${compact ? 'col-auto ms-2 px-4 rounded-pill' : 'w-100'}`}
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
            {showDate ? 'Request site visit' : 'Send enquiry'}
          </>
        )}
      </button>
    </form>
  );
}
