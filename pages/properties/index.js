import { useState } from 'react';
import { useRouter } from 'next/router';
import PropertyCard from '@/components/PropertyCard';
import MapView from '@/components/MapView';
import { listProperties } from '@/lib/store';
import { CITIES, PROPERTY_TYPES, priceLabel } from '@/lib/format';

export async function getServerSideProps({ query }) {
  const properties = listProperties(query);
  return { props: { properties, query } };
}

const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'area-desc', label: 'Largest area' },
  { value: 'popular', label: 'Most viewed' },
];

export default function Properties({ properties, query }) {
  const router = useRouter();
  const [view, setView] = useState('grid'); // grid | map
  const [filters, setFilters] = useState({
    q: query.q || '',
    city: query.city || '',
    type: query.type || '',
    listingType: query.listingType || '',
    beds: query.beds || '',
    maxPrice: query.maxPrice || '',
    sort: query.sort || 'newest',
  });

  function apply(next = filters) {
    const q = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== '' && v !== 'newest')
    );
    router.push({ pathname: '/properties', query: q });
  }

  function set(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (key !== 'q') apply(next);
  }

  const markers = properties.map((p) => ({
    lat: p.lat,
    lng: p.lng,
    popup: `<a href="/properties/${p.id}"><b>${p.title}</b></a><br/>${priceLabel(p)} · ${p.locality}, ${p.city}`,
  }));

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h1 className="h3 fw-bold mb-0">Properties</h1>
          <span className="text-secondary small">
            {properties.length} result{properties.length !== 1 && 's'}
            {filters.city && ` in ${filters.city}`}
          </span>
        </div>
        <div className="btn-group" role="group" aria-label="View toggle">
          <button
            className={`btn btn-sm ${view === 'grid' ? 'btn-brand' : 'btn-outline-brand'}`}
            onClick={() => setView('grid')}
          >
            <i className="bi bi-grid-3x3-gap me-1" />
            Grid
          </button>
          <button
            className={`btn btn-sm ${view === 'map' ? 'btn-brand' : 'btn-outline-brand'}`}
            onClick={() => setView('map')}
          >
            <i className="bi bi-map me-1" />
            Map
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form
            className="row g-2 align-items-end"
            onSubmit={(e) => {
              e.preventDefault();
              apply();
            }}
          >
            <div className="col-md-3">
              <label className="form-label small text-secondary mb-1">Search</label>
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Locality, title…"
                  value={filters.q}
                  onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                />
                <button className="btn btn-brand" aria-label="Search">
                  <i className="bi bi-search" />
                </button>
              </div>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small text-secondary mb-1">City</label>
              <select
                className="form-select"
                value={filters.city}
                onChange={(e) => set('city', e.target.value)}
              >
                <option value="">All</option>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small text-secondary mb-1">Type</label>
              <select
                className="form-select"
                value={filters.type}
                onChange={(e) => set('type', e.target.value)}
              >
                <option value="">All</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small text-secondary mb-1">Buy / Rent</label>
              <select
                className="form-select"
                value={filters.listingType}
                onChange={(e) => set('listingType', e.target.value)}
              >
                <option value="">Both</option>
                <option value="sale">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div className="col-6 col-md-1">
              <label className="form-label small text-secondary mb-1">Beds</label>
              <select
                className="form-select"
                value={filters.beds}
                onChange={(e) => set('beds', e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small text-secondary mb-1">Sort by</label>
              <select
                className="form-select"
                value={filters.sort}
                onChange={(e) => set('sort', e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-house-slash display-3 text-secondary" />
          <h5 className="mt-3">No properties match your filters</h5>
          <p className="text-secondary">Try widening your search criteria.</p>
          <button className="btn btn-outline-brand" onClick={() => router.push('/properties')}>
            Clear all filters
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="row g-4">
          {properties.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-5" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            <div className="d-flex flex-column gap-3">
              {properties.map((p) => (
                <PropertyCard property={p} key={p.id} />
              ))}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="sticky-top" style={{ top: 80 }}>
              <MapView markers={markers} height="75vh" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
