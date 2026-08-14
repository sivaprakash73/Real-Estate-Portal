import Link from 'next/link';
import Head from 'next/head';
import LeadForm from '@/components/LeadForm';
import MapView from '@/components/MapView';
import { listProperties } from '@/lib/store';
import { formatINRCompact, normalizeUnitStatus, unitCode, unitStatusMeta } from '@/lib/format';

export async function getServerSideProps() {
  const units = listProperties({ sort: 'price-asc' }).map((unit) => ({
    ...unit,
    status: normalizeUnitStatus(unit.status),
  }));
  return { props: { units } };
}

const highlights = [
  { icon: 'tree', value: '62%', label: 'Open green space' },
  { icon: 'house-heart', value: '44', label: 'Limited residences' },
  { icon: 'geo-alt', value: '12 min', label: 'From the IT corridor' },
  { icon: 'shield-check', value: 'RERA', label: 'Approved project' },
];

export default function Home({ units }) {
  const available = units.filter((u) => u.status === 'available');
  const enquiryUnit = available[0] || units[0];
  const heroImage = units.flatMap((u) => u.images || [])[0];
  const gallery = [...new Set(units.flatMap((u) => u.images || []))].slice(0, 6);
  const minPrice = Math.min(...units.map((u) => Number(u.price) || Infinity));
  const whatsappText = encodeURIComponent('Hello, I would like to know more about Aurelia Greens and book a site visit.');

  return (
    <>
      <Head>
        <title>Aurelia Greens | Plots & villas in Coimbatore</title>
        <meta name="description" content="Explore Aurelia Greens, a premium plotted and villa community in Coimbatore. Check live availability, prices and book a site visit." />
      </Head>

      <section
        className="project-hero"
        style={{ backgroundImage: `linear-gradient(90deg, rgba(17,36,30,.88) 0%, rgba(17,36,30,.62) 48%, rgba(17,36,30,.12) 100%), url('${heroImage || '/images/hero-bg.svg'}')` }}
      >
        <div className="container hero-inner">
          <div className="hero-kicker"><span /> NOW OPEN FOR BOOKINGS</div>
          <h1>A rare place to<br /><em>put down roots.</em></h1>
          <p>A private collection of considered plots and villas, shaped by nature on Coimbatore&apos;s most promising growth corridor.</p>
          <div className="d-flex flex-wrap gap-3">
            <Link href="#units" className="btn btn-light btn-lg rounded-pill px-4">Explore availability <i className="bi bi-arrow-down-right ms-2" /></Link>
            <Link href="#enquire" className="btn btn-outline-light btn-lg rounded-pill px-4">Book a private tour</Link>
          </div>
          <div className="hero-price"><small>RESIDENCES FROM</small><strong>{formatINRCompact(minPrice)}</strong><span>onwards</span></div>
        </div>
        <div className="hero-scroll">SCROLL TO DISCOVER <i className="bi bi-arrow-down" /></div>
      </section>

      <section className="highlight-strip">
        <div className="container"><div className="row g-0">
          {highlights.map((item) => (
            <div className="col-6 col-lg-3" key={item.label}>
              <div className="highlight-item"><i className={`bi bi-${item.icon}`} /><span><strong>{item.value}</strong><small>{item.label}</small></span></div>
            </div>
          ))}
        </div></div>
      </section>

      <section id="overview" className="project-section overview-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="image-composition">
                <img src={gallery[1] || heroImage} alt="Landscaped residences at Aurelia Greens" className="image-main" />
                <img src={gallery[2] || heroImage} alt="Aurelia Greens outdoor spaces" className="image-inset" />
                <span className="image-note"><strong>5.8</strong><small>ACRES OF<br />THOUGHTFUL LIVING</small></span>
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <p className="eyebrow">THE PROJECT</p>
              <h2 className="editorial-title">Room to breathe.<br /><em>Space to belong.</em></h2>
              <p className="lead-copy">Aurelia Greens is designed around a simple belief: the finest homes make life feel more natural. Wide, tree-lined avenues, generous setbacks and a central garden create a community with space in all the right places.</p>
              <p className="lead-copy">Choose a ready-to-build plot or an architect-designed villa, each with clear titles, future-ready infrastructure and a considered relationship with the landscape.</p>
              <div className="detail-grid">
                <span><small>PROJECT TYPE</small><strong>Plots & villas</strong></span>
                <span><small>POSSESSION</small><strong>December 2027</strong></span>
                <span><small>DEVELOPMENT</small><strong>5.8 acres</strong></span>
                <span><small>UNITS</small><strong>44 residences</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="masterplan" className="project-section masterplan-section">
        <div className="container">
          <div className="section-heading centered">
            <p className="eyebrow">MASTERPLAN</p>
            <h2 className="editorial-title">Find your place <em>in the green.</em></h2>
            <p>Live inventory, updated by our sales team. Select a unit to view its details.</p>
          </div>
          <div className="masterplan-card">
            <div className="plan-compass"><i className="bi bi-arrow-up" /><span>N</span></div>
            <div className="plan-road road-top">12 M WIDE AVENUE</div>
            <div className="plot-grid">
              {units.slice(0, 12).map((unit) => {
                const meta = unitStatusMeta(unit.status);
                return (
                  <Link href={`/properties/${unit.id}`} className={`plot-cell plot-${unit.status}`} key={unit.id} title={`${unitCode(unit)} · ${meta.label}`}>
                    <span>{unitCode(unit)}</span><small>{unit.area.toLocaleString('en-IN')} sq.ft</small>
                  </Link>
                );
              })}
              <div className="plan-park"><i className="bi bi-tree-fill" /><strong>THE GROVE</strong><small>Central park & pavilion</small></div>
            </div>
            <div className="plan-road">18 M MAIN ROAD · GRAND ENTRANCE</div>
          </div>
          <div className="plan-legend">
            {['available', 'reserved', 'sold'].map((status) => <span key={status}><i className={`legend-${status}`} />{unitStatusMeta(status).label}</span>)}
            <small>Availability is indicative and subject to confirmation.</small>
          </div>
        </div>
      </section>

      <section id="units" className="project-section units-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">LIVE AVAILABILITY</p><h2 className="editorial-title">Choose a home<br /><em>that fits your life.</em></h2></div>
            <p>Transparent pricing and real-time status, so you can explore with complete confidence.</p>
          </div>
          <div className="availability-card">
            <div className="availability-head"><span>{available.length} units currently available</span><span>Price includes land and base specification</span></div>
            <div className="table-responsive">
              <table className="table unit-table mb-0">
                <thead><tr><th>Unit</th><th>Type</th><th>Area</th><th>Facing</th><th>Price</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {units.slice(0, 8).map((unit) => {
                    const meta = unitStatusMeta(unit.status);
                    return <tr key={unit.id}>
                      <td><strong>{unitCode(unit)}</strong></td><td>{unit.type}</td><td>{unit.area.toLocaleString('en-IN')} sq.ft</td><td>{unit.id % 2 ? 'East' : 'North'}</td><td><strong>{formatINRCompact(unit.price)}</strong></td>
                      <td><span className={`unit-status status-${unit.status}`}><i />{meta.label}</span></td>
                      <td className="text-end"><Link href={`/properties/${unit.id}`} className="unit-link">View <i className="bi bi-arrow-up-right" /></Link></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
            <div className="availability-foot"><span>Need help choosing the right unit?</span><Link href="#enquire">Speak with an advisor <i className="bi bi-arrow-right" /></Link></div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && <section id="gallery" className="project-section gallery-section">
        <div className="container-fluid px-lg-5">
          <div className="section-heading centered"><p className="eyebrow">GALLERY</p><h2 className="editorial-title">Life, <em>beautifully framed.</em></h2></div>
          <div className="project-gallery">
            {gallery.map((image, index) => <figure key={image} className={`gallery-item gallery-${index + 1}`}><img src={image} alt={`Aurelia Greens gallery view ${index + 1}`} loading="lazy" /></figure>)}
          </div>
        </div>
      </section>}

      <section id="location" className="project-section location-section">
        <div className="container"><div className="row g-0 location-card">
          <div className="col-lg-5 location-copy">
            <p className="eyebrow">LOCATION</p><h2 className="editorial-title">Connected to everything.<br /><em>Away from the noise.</em></h2>
            <p>Saravanampatti puts work, learning and everyday essentials within easy reach, while the community remains calm and green.</p>
            <div className="location-list">
              <span><strong>06 min</strong><small>Kumaraguru College</small></span><span><strong>12 min</strong><small>CHIL SEZ / IT corridor</small></span><span><strong>18 min</strong><small>Coimbatore airport</small></span><span><strong>20 min</strong><small>City centre</small></span>
            </div>
            <a href="https://maps.google.com/?q=11.0768,77.0064" target="_blank" rel="noreferrer" className="text-link">Get directions <i className="bi bi-arrow-up-right" /></a>
          </div>
          <div className="col-lg-7 location-map"><MapView markers={[{ lat: 11.0768, lng: 77.0064, popup: '<b>Aurelia Greens</b><br/>Saravanampatti, Coimbatore' }]} height={520} /></div>
        </div></div>
      </section>

      {enquiryUnit && <section id="enquire" className="project-section enquiry-section">
        <div className="container"><div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <p className="eyebrow">PRIVATE SITE VISIT</p><h2 className="editorial-title">Come experience<br /><em>Aurelia for yourself.</em></h2>
            <p className="lead-copy">Share your details and our project advisor will call to confirm a convenient time. Visits are available every day from 9:00 AM to 6:00 PM.</p>
            <div className="advisor-contact"><i className="bi bi-whatsapp" /><span><small>PREFER WHATSAPP?</small><strong>+91 98400 12345</strong></span><a href={`https://wa.me/919840012345?text=${whatsappText}`} target="_blank" rel="noreferrer">Start chat</a></div>
          </div>
          <div className="col-lg-6 offset-lg-1"><div className="enquiry-card"><h5>Book your visit</h5><p>Our advisor will confirm your appointment shortly.</p><LeadForm property={enquiryUnit} defaultInterest="site-visit" showDate compact /></div></div>
        </div></div>
      </section>}

      <a href={`https://wa.me/919840012345?text=${whatsappText}`} className="whatsapp-float" target="_blank" rel="noreferrer" aria-label="Chat with Aurelia Greens on WhatsApp"><i className="bi bi-whatsapp" /><span>Chat with us</span></a>
    </>
  );
}
