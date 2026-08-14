import Link from 'next/link';
import { priceLabel, timeAgo, PLACEHOLDER_IMG, normalizeUnitStatus, unitStatusMeta } from '@/lib/format';

function onImgError(e) {
  if (e.currentTarget.src.endsWith(PLACEHOLDER_IMG)) return;
  e.currentTarget.src = PLACEHOLDER_IMG;
}

export default function PropertyCard({ property }) {
  const p = property;
  const status = normalizeUnitStatus(p.status);
  const statusMeta = unitStatusMeta(status);
  return (
    <div className="card property-card h-100 shadow-sm">
      <Link href={`/properties/${p.id}`} className="text-decoration-none">
        <div className="card-img-wrap">
          <span
            className={`badge badge-listing ${
              p.listingType === 'rent' ? 'text-bg-info' : 'text-bg-success'
            }`}
          >
            {p.listingType === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {status !== 'available' && <span className={`badge badge-sold text-bg-${statusMeta.badge}`}>{statusMeta.label}</span>}
          <img
            src={p.images[0] || PLACEHOLDER_IMG}
            alt={p.title}
            loading="lazy"
            onError={onImgError}
          />
        </div>
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <span className="price-tag">{priceLabel(p)}</span>
          <span className="badge text-bg-light border">{p.type}</span>
        </div>
        <h6 className="card-title mb-1">
          <Link
            href={`/properties/${p.id}`}
            className="text-decoration-none text-dark stretched-link-safe"
          >
            {p.title}
          </Link>
        </h6>
        <p className="text-secondary small mb-3">
          <i className="bi bi-geo-alt me-1" />
          {p.locality}, {p.city}
        </p>
        <div className="d-flex gap-3 text-secondary small mt-auto">
          {p.beds > 0 && (
            <span>
              <i className="bi bi-door-open me-1" />
              {p.beds} Beds
            </span>
          )}
          {p.baths > 0 && (
            <span>
              <i className="bi bi-droplet me-1" />
              {p.baths} Baths
            </span>
          )}
          <span>
            <i className="bi bi-arrows-fullscreen me-1" />
            {p.area.toLocaleString('en-IN')} sqft
          </span>
        </div>
      </div>
      <div className="card-footer bg-white border-0 d-flex justify-content-between text-secondary small pb-3">
        <span>
          <i className="bi bi-eye me-1" />
          {p.views} views
        </span>
        <span>{timeAgo(p.createdAt)}</span>
      </div>
    </div>
  );
}
