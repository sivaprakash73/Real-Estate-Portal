import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import MapView from '@/components/MapView';
import LoanCalculator from '@/components/LoanCalculator';
import LeadForm from '@/components/LeadForm';
import PropertyCard from '@/components/PropertyCard';
import { getProperty, getAgent, listProperties, incrementViews } from '@/lib/store';
import { formatINR, priceLabel, formatDate, PLACEHOLDER_IMG, normalizeUnitStatus, unitCode, unitStatusMeta } from '@/lib/format';

export async function getServerSideProps({ params }) {
  const property = getProperty(params.id);
  if (!property) return { notFound: true };
  incrementViews(params.id);
  const agent = getAgent(property.agentId);
  property.status = normalizeUnitStatus(property.status);
  const similar = listProperties({ city: property.city, status: 'available' })
    .filter((p) => p.id !== property.id)
    .slice(0, 3);
  return { props: { property, agent, similar } };
}

export default function PropertyDetail({ property: p, agent, similar }) {
  const statusMeta = unitStatusMeta(p.status);
  const pricePerSqft =
    p.listingType === 'sale' && p.area > 0 ? Math.round(p.price / p.area) : null;

  const specs = [
    p.beds > 0 && { icon: 'door-open', label: 'Bedrooms', value: p.beds },
    p.baths > 0 && { icon: 'droplet', label: 'Bathrooms', value: p.baths },
    { icon: 'arrows-fullscreen', label: 'Built-up Area', value: `${p.area.toLocaleString('en-IN')} sqft` },
    { icon: 'house-gear', label: 'Furnishing', value: p.furnishing },
    { icon: 'building', label: 'Type', value: p.type },
    pricePerSqft && { icon: 'cash-coin', label: 'Price / sqft', value: formatINR(pricePerSqft) },
  ].filter(Boolean);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="small">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Home</Link></li>
          <li className="breadcrumb-item"><Link href="/properties">Properties</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{p.title}</li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
        <div>
          <h1 className="h3 fw-bold mb-1">
            {p.title}
            <span className={`badge text-bg-${statusMeta.badge} ms-2 align-middle`}>{statusMeta.label}</span>
          </h1>
          <p className="text-secondary mb-0">
            <i className="bi bi-geo-alt me-1" />
            {p.address}
          </p>
        </div>
        <div className="text-end">
          <div className="small text-secondary text-uppercase">{unitCode(p)}</div>
          <div className="fs-3 fw-bold text-brand">{priceLabel(p)}</div>
          <span
            className={`badge ${p.listingType === 'rent' ? 'text-bg-info' : 'text-bg-success'}`}
          >
            {p.listingType === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <ImageGallery images={p.images} title={p.title} />

          <div className="row g-2 mt-3">
            {specs.map((s) => (
              <div className="col-6 col-md-4" key={s.label}>
                <div className="spec-chip d-flex align-items-center gap-2 h-100">
                  <i className={`bi bi-${s.icon} fs-5 text-brand`} />
                  <div>
                    <div className="small text-secondary">{s.label}</div>
                    <div className="fw-semibold">{s.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">About this property</h5>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                {p.description}
              </p>
              <div className="text-secondary small">
                Listed on {formatDate(p.createdAt)} · {p.views} views
              </div>
            </div>
          </div>

          {p.amenities.length > 0 && (
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Amenities</h5>
                <div className="d-flex flex-wrap gap-2">
                  {p.amenities.map((a) => (
                    <span key={a} className="badge text-bg-light border py-2 px-3 fw-normal">
                      <i className="bi bi-check2-circle me-1 text-success" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-geo-alt me-2 text-brand" />
                Location
              </h5>
              <MapView
                markers={[
                  {
                    lat: p.lat,
                    lng: p.lng,
                    popup: `<b>${p.title}</b><br/>${p.locality}, ${p.city}`,
                  },
                ]}
                height={360}
              />
            </div>
          </div>

          {p.listingType === 'sale' && (
            <div className="mt-4">
              <LoanCalculator initialPrice={p.price} />
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: 80 }}>
            {agent && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="avatar-sm"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER_IMG;
                      }}
                    />
                    <div>
                      <div className="fw-bold">{agent.name}</div>
                      <div className="small text-secondary">{agent.agency}</div>
                      <div className="small text-warning">
                        <i className="bi bi-star-fill me-1" />
                        {agent.rating}
                        <span className="text-secondary ms-1">· {agent.deals} deals</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid gap-2 mb-1">
                    <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="btn btn-outline-brand btn-sm">
                      <i className="bi bi-telephone me-2" />
                      {agent.phone}
                    </a>
                    <a
                      href={`https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello, I am interested in ${unitCode(p)} at Aurelia Greens.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm"
                    >
                      <i className="bi bi-whatsapp me-2" /> WhatsApp advisor
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-chat-left-text me-2 text-brand" />
                  Interested in this property?
                </h6>
                <LeadForm property={p} agent={agent} showDate />
              </div>
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-5">
          <h4 className="section-title mb-4">Similar properties in {p.city}</h4>
          <div className="row g-4">
            {similar.map((sp) => (
              <div className="col-md-6 col-lg-4" key={sp.id}>
                <PropertyCard property={sp} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
