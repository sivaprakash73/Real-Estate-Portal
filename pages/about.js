import Head from 'next/head';
import Link from 'next/link';

const values = [
  { icon: 'patch-check', title: 'Clear advice', text: 'Straightforward property guidance, so you can make each decision with confidence.' },
  { icon: 'geo-alt', title: 'Local knowledge', text: 'A focused understanding of neighbourhoods, growth corridors and everyday essentials.' },
  { icon: 'people', title: 'Personal service', text: 'Helpful support from your first enquiry through to the next step in your journey.' },
];

export default function AboutPage() {
  return <>
    <Head><title>About us | Vetrivelan Realty</title><meta name="description" content="Learn about Vetrivelan Realty and our approach to property guidance." /></Head>
    <section className="static-hero"><div className="container">
      <p className="eyebrow">ABOUT VETRIVELAN REALTY</p>
      <h1>Property decisions,<br /><em>made with clarity.</em></h1>
      <p>We bring a calm, practical approach to buying, selling and discovering property in Tamil Nadu.</p>
    </div></section>

    <section className="static-section"><div className="container"><div className="row g-5 align-items-center">
      <div className="col-lg-6"><p className="eyebrow">OUR APPROACH</p><h2 className="editorial-title">Every move starts with<br /><em>the right conversation.</em></h2></div>
      <div className="col-lg-5 offset-lg-1"><p className="lead-copy">Whether you are looking for a first home, a family plot or your next investment, Vetrivelan Realty helps you understand the options before you choose.</p><p className="lead-copy mb-0">Our role is simple: listen carefully, share useful local insight and make the property search feel more manageable.</p></div>
    </div></div></section>

    <section className="static-section static-section-soft"><div className="container"><div className="row g-4">
      {values.map((value) => <div className="col-md-4" key={value.title}><article className="info-card h-100"><i className={`bi bi-${value.icon}`} /><h2 className="h5">{value.title}</h2><p>{value.text}</p></article></div>)}
    </div></div></section>

    <section className="static-cta"><div className="container d-flex flex-wrap gap-4 justify-content-between align-items-center"><div><p className="eyebrow mb-2">LET&apos;S TALK</p><h2 className="editorial-title mb-0">Looking for a property?</h2></div><Link href="/contact" className="btn btn-light rounded-pill px-4">Start a conversation <i className="bi bi-arrow-up-right ms-2" /></Link></div></section>
  </>;
}
