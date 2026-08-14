import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { CITIES, PROPERTY_TYPES, UNIT_STATUSES, normalizeUnitStatus } from '@/lib/format';

const EMPTY = {
  unitCode: '',
  title: '',
  description: '',
  type: 'Apartment',
  listingType: 'sale',
  price: '',
  area: '',
  beds: '',
  baths: '',
  furnishing: 'Unfurnished',
  city: CITIES[0],
  locality: '',
  address: '',
  lat: '',
  lng: '',
  imagesText: '',
  amenitiesText: '',
  featured: false,
  status: 'available',
  agentId: '',
};

export default function PropertyFormPage() {
  return (
    <DashboardShell active="listings">
      {({ agent, agents }) => <PropertyForm agent={agent} agents={agents} />}
    </DashboardShell>
  );
}

function PropertyForm({ agent, agents }) {
  const router = useRouter();
  const editId = router.query.id ? Number(router.query.id) : null;
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(Boolean(editId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!editId) {
      setForm({ ...EMPTY, agentId: agent.id });
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/properties/${editId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.property) throw new Error('Property not found');
        const p = d.property;
        setForm({
          unitCode: p.unitCode || '',
          title: p.title,
          description: p.description,
          type: p.type,
          listingType: p.listingType,
          price: p.price,
          area: p.area,
          beds: p.beds,
          baths: p.baths,
          furnishing: p.furnishing,
          city: p.city,
          locality: p.locality,
          address: p.address,
          lat: p.lat ?? '',
          lng: p.lng ?? '',
          imagesText: (p.images || []).join('\n'),
          amenitiesText: (p.amenities || []).join(', '),
          featured: Boolean(p.featured),
          status: normalizeUnitStatus(p.status),
          agentId: p.agentId || agent.id,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router.isReady, editId]);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      unitCode: form.unitCode,
      title: form.title,
      description: form.description,
      type: form.type,
      listingType: form.listingType,
      price: Number(form.price),
      area: Number(form.area) || 0,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      furnishing: form.furnishing,
      city: form.city,
      locality: form.locality,
      address: form.address,
      lat: form.lat === '' ? null : Number(form.lat),
      lng: form.lng === '' ? null : Number(form.lng),
      images: form.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      amenities: form.amenitiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      status: form.status,
      agentId: Number(form.agentId || agent.id),
    };
    try {
      const res = await fetch(editId ? `/api/properties/${editId}` : '/api/properties', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      router.push('/dashboard/properties');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-brand" role="status" />
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold mb-0">
            {editId ? 'Edit plot / unit' : 'Add plot / unit'}
          </h6>
          <Link href="/dashboard/properties" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" />
            Back to inventory
          </Link>
        </div>

        <form onSubmit={submit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Unit code *</label>
            <input className="form-control" required value={form.unitCode} onChange={set('unitCode')} placeholder="e.g. V-12" />
          </div>
          <div className="col-md-9">
            <label className="form-label small fw-semibold">Unit title *</label>
            <input
              className="form-control"
              required
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. East-facing garden villa"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Availability</label>
            <select className="form-select" value={form.status} onChange={set('status')}>
              {UNIT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Sales owner</label>
            <select className="form-select" value={form.agentId} onChange={set('agentId')}>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Category</label>
            <select className="form-select" value={form.type} onChange={set('type')}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="col-md-3 d-none">
            <label className="form-label small fw-semibold">Listing *</label>
            <select className="form-select" value={form.listingType} onChange={set('listingType')}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className="col-md-3 d-none">
            <label className="form-label small fw-semibold">Type *</label>
            <select className="form-select" value={form.type} onChange={set('type')}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">
              Price (₹{form.listingType === 'rent' ? '/month' : ''}) *
            </label>
            <input
              className="form-control"
              type="number"
              min={0}
              required
              value={form.price}
              onChange={set('price')}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Area (sqft)</label>
            <input
              className="form-control"
              type="number"
              min={0}
              value={form.area}
              onChange={set('area')}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Bedrooms</label>
            <input className="form-control" type="number" min={0} value={form.beds} onChange={set('beds')} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Bathrooms</label>
            <input className="form-control" type="number" min={0} value={form.baths} onChange={set('baths')} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Furnishing</label>
            <select className="form-select" value={form.furnishing} onChange={set('furnishing')}>
              <option>Unfurnished</option>
              <option>Semi-Furnished</option>
              <option>Fully Furnished</option>
              <option>NA</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">City *</label>
            <select className="form-select" value={form.city} onChange={set('city')}>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Locality</label>
            <input
              className="form-control"
              value={form.locality}
              onChange={set('locality')}
              placeholder="e.g. Adyar"
            />
          </div>
          <div className="col-md-8">
            <label className="form-label small fw-semibold">Full Address</label>
            <input className="form-control" value={form.address} onChange={set('address')} />
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-semibold">Latitude</label>
            <input
              className="form-control"
              type="number"
              step="any"
              value={form.lat}
              onChange={set('lat')}
              placeholder="13.0067"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Longitude</label>
            <input
              className="form-control"
              type="number"
              step="any"
              value={form.lng}
              onChange={set('lng')}
              placeholder="80.2572"
            />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="featuredCheck"
                checked={form.featured}
                onChange={set('featured')}
              />
              <label className="form-check-label small" htmlFor="featuredCheck">
                Feature this property on the home page
              </label>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={set('description')}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-semibold">Image URLs (one per line)</label>
            <textarea
              className="form-control font-monospace small"
              rows={4}
              value={form.imagesText}
              onChange={set('imagesText')}
              placeholder={'https://…/photo1.jpg\nhttps://…/photo2.jpg'}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold">Amenities (comma separated)</label>
            <textarea
              className="form-control small"
              rows={4}
              value={form.amenitiesText}
              onChange={set('amenitiesText')}
              placeholder="Swimming Pool, Gym, Covered Parking"
            />
          </div>

          {error && (
            <div className="col-12">
              <div className="alert alert-danger py-2 small mb-0">{error}</div>
            </div>
          )}

          <div className="col-12 d-flex gap-2">
            <button className="btn btn-brand fw-semibold px-4" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving…
                </>
              ) : editId ? (
                'Save Changes'
              ) : (
                'Create unit'
              )}
            </button>
            <Link href="/dashboard/properties" className="btn btn-outline-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
