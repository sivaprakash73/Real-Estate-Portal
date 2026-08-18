import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';

export async function getStaticProps() {
  const file = path.join(process.cwd(), 'content', 'demo-listings.json');
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));

  return {
    props: {
      title: content.title || 'Sample properties',
      intro: content.intro || '',
      listings: Array.isArray(content.listings) ? content.listings : [],
    },
  };
}

export default function StaticDemoPage({ title, intro, listings }) {
  return <>
    <Head><title>Static JSON demo | Vetrivelan Realty</title><meta name="description" content="A static property demo powered by a local JSON file." /></Head>
    <section className="static-hero static-demo-hero"><div className="container"><p className="eyebrow">STATIC JSON DEMO</p><h1>{title}<br /><em>without a database.</em></h1><p>{intro}</p></div></section>
    <section className="static-section"><div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5"><div><p className="eyebrow">DEMO LISTINGS</p><h2 className="editorial-title mb-0">Simple, editable<br /><em>sample content.</em></h2></div><span className="static-data-badge"><i className="bi bi-filetype-json me-2" />content/demo-listings.json</span></div>
      <div className="row g-4">{listings.map((listing) => <div className="col-md-6 col-xl-4" key={listing.id}><article className="demo-listing h-100"><img src={listing.image || '/images/placeholder.svg'} alt={listing.title} /><div className="p-4"><div className="d-flex justify-content-between gap-3 align-items-start"><span className="demo-listing-type">{listing.type}</span><strong className="demo-listing-price">{listing.price}</strong></div><h2>{listing.title}</h2><p className="demo-listing-location"><i className="bi bi-geo-alt me-1" />{listing.location}</p><div className="demo-listing-features">{listing.area} <span>·</span> {listing.features}</div></div></article></div>)}</div>
      <div className="static-demo-note mt-5"><i className="bi bi-lightbulb" /><span><strong>How it works:</strong> edit <code>content/demo-listings.json</code>, then run <code>npm run build</code>. This page is generated as static HTML at build time and does not call an API.</span></div>
      <div className="text-center mt-5"><Link href="/contact" className="btn btn-brand rounded-pill px-4">Use this as your demo site <i className="bi bi-arrow-right ms-2" /></Link></div>
    </div></section>
  </>;
}
