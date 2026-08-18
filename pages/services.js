import Head from 'next/head';
import Link from 'next/link';

const services = [
  { icon: 'house-door', title: 'Buying support', text: 'Shortlist homes, villas and plots that match your needs, budget and preferred area.' },
  { icon: 'signpost-split', title: 'Selling guidance', text: 'Present your property clearly and connect with relevant, serious buyers.' },
  { icon: 'graph-up-arrow', title: 'Investment advice', text: 'Explore property opportunities with a practical view of location and long-term potential.' },
  { icon: 'calendar2-check', title: 'Site visits', text: 'Arrange a convenient visit and get the information you need before you decide.' },
];

export default function ServicesPage() {
  return <>
    <Head><title>Services | Vetrivelan Realty</title><meta name="description" content="Property buying, selling, investment and site-visit support from Vetrivelan Realty." /></Head>
    <section className="static-hero"><div className="container"><p className="eyebrow">OUR SERVICES</p><h1>Support for every<br /><em>property decision.</em></h1><p>Helpful expertise, clear information and a more personal real-estate experience.</p></div></section>
    <section className="static-section"><div className="container"><div className="row g-4">
      {services.map((service) => <div className="col-sm-6" key={service.title}><article className="service-card h-100"><span><i className={`bi bi-${service.icon}`} /></span><h2>{service.title}</h2><p>{service.text}</p><Link href="/contact">Ask about this service <i className="bi bi-arrow-right ms-1" /></Link></article></div>)}
    </div></div></section>
    <section className="static-section static-section-soft"><div className="container text-center"><p className="eyebrow">AVAILABLE LISTINGS</p><h2 className="editorial-title">See what&apos;s currently<br /><em>on the market.</em></h2><p className="lead-copy mx-auto" style={{ maxWidth: 600 }}>Browse available property listings, then contact us when one catches your eye.</p><Link href="/properties" className="btn btn-brand rounded-pill px-4">Browse properties <i className="bi bi-arrow-right ms-2" /></Link></div></section>
  </>;
}
