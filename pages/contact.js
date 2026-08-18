import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const initialForm = { name: '', phone: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(event) {
    event.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, interest: 'info' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not send your enquiry.');
      setForm(initialForm);
      setState({ status: 'success', message: 'Thank you. Your enquiry has been received.' });
    } catch (error) {
      setState({ status: 'error', message: error.message || 'We could not send your enquiry.' });
    }
  }

  return <>
    <Head><title>Contact us | Vetrivelan Realty</title><meta name="description" content="Contact Vetrivelan Realty to discuss your property requirements or arrange a visit." /></Head>
    <section className="static-hero"><div className="container"><p className="eyebrow">CONTACT US</p><h1>Let&apos;s find the right<br /><em>place for you.</em></h1><p>Tell us what you are looking for, and a Vetrivelan Realty advisor will get back to you.</p></div></section>
    <section className="static-section"><div className="container"><div className="row g-5">
      <div className="col-lg-5"><p className="eyebrow">START A CONVERSATION</p><h2 className="editorial-title">Your next property<br /><em>starts here.</em></h2><p className="lead-copy">Share the kind of home, plot or investment you have in mind. You can also browse the available listings before getting in touch.</p><Link href="/properties" className="text-link">Browse available properties <i className="bi bi-arrow-right ms-1" /></Link></div>
      <div className="col-lg-6 offset-lg-1"><form className="contact-form" onSubmit={submit}>
        <div className="row g-3"><div className="col-md-6"><label className="form-label" htmlFor="name">Your name</label><input id="name" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="phone">Phone number</label><input id="phone" className="form-control" required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div><div className="col-12"><label className="form-label" htmlFor="email">Email address <span className="text-secondary">(optional)</span></label><input id="email" className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><div className="col-12"><label className="form-label" htmlFor="message">What are you looking for?</label><textarea id="message" className="form-control" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="For example: a villa in Coimbatore, a plot for investment…" /></div></div>
        {state.status === 'success' && <div className="alert alert-success mt-3 mb-0">{state.message}</div>}
        {state.status === 'error' && <div className="alert alert-danger mt-3 mb-0">{state.message}</div>}
        <button className="btn btn-brand mt-4" disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Sending…' : 'Send enquiry'} <i className="bi bi-arrow-right ms-2" /></button>
      </form></div>
    </div></div></section>
  </>;
}
