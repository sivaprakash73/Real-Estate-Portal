import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { priceLabel, formatDate, PLACEHOLDER_IMG } from '@/lib/format';

export default function DashboardProperties() {
  return (
    <DashboardShell active="listings">
      {({ agent }) => <Listings agent={agent} />}
    </DashboardShell>
  );
}

function Listings({ agent }) {
  const [properties, setProperties] = useState(null);
  const [leads, setLeads] = useState([]);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    fetch(`/api/properties?agentId=${agent.id}`)
      .then((r) => r.json())
      .then((d) => setProperties(d.properties));
    fetch(`/api/leads?agentId=${agent.id}`)
      .then((r) => r.json())
      .then((d) => setLeads(d.leads));
  }, [agent.id]);

  useEffect(() => {
    setProperties(null);
    load();
  }, [load]);

  async function toggleStatus(p) {
    setBusyId(p.id);
    await fetch(`/api/properties/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: p.status === 'active' ? 'sold' : 'active' }),
    });
    setBusyId(null);
    load();
  }

  async function remove(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    await fetch(`/api/properties/${p.id}`, { method: 'DELETE' });
    setBusyId(null);
    load();
  }

  if (!properties) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-brand" role="status" />
      </div>
    );
  }

  const leadCount = (propertyId) =>
    leads.filter((l) => l.propertyId === propertyId).length;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">
            My Listings <span className="text-secondary fw-normal">({properties.length})</span>
          </h6>
          <Link href="/dashboard/properties/form" className="btn btn-brand btn-sm">
            <i className="bi bi-plus-lg me-1" />
            Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <p className="text-secondary mb-0">
            You have no listings yet. Click “Add Property” to create your first one.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Property</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-center">Views</th>
                  <th className="text-center">Leads</th>
                  <th>Listed</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td style={{ minWidth: 240 }}>
                      <div className="d-flex gap-2 align-items-center">
                        <img
                          src={p.images[0] || PLACEHOLDER_IMG}
                          alt={p.title}
                          className="rounded"
                          style={{ width: 56, height: 42, objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMG;
                          }}
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/properties/${p.id}`}
                            className="fw-semibold small text-decoration-none text-dark d-block text-truncate"
                            style={{ maxWidth: 260 }}
                          >
                            {p.title}
                          </Link>
                          <span className="text-secondary small">
                            {p.locality}, {p.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="fw-semibold">{priceLabel(p)}</td>
                    <td>
                      <span
                        className={`badge fw-normal ${
                          p.status === 'active' ? 'text-bg-success' : 'text-bg-danger'
                        }`}
                      >
                        {p.status === 'active' ? 'Active' : 'Sold'}
                      </span>
                    </td>
                    <td className="text-center">{p.views}</td>
                    <td className="text-center">{leadCount(p.id)}</td>
                    <td className="text-secondary small">{formatDate(p.createdAt)}</td>
                    <td className="text-end" style={{ minWidth: 150 }}>
                      <div className="btn-group btn-group-sm">
                        <Link
                          href={`/dashboard/properties/form?id=${p.id}`}
                          className="btn btn-outline-secondary"
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </Link>
                        <button
                          className="btn btn-outline-secondary"
                          title={p.status === 'active' ? 'Mark as sold' : 'Mark as active'}
                          disabled={busyId === p.id}
                          onClick={() => toggleStatus(p)}
                        >
                          <i className={`bi bi-${p.status === 'active' ? 'bag-check' : 'arrow-counterclockwise'}`} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          title="Delete"
                          disabled={busyId === p.id}
                          onClick={() => remove(p)}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
