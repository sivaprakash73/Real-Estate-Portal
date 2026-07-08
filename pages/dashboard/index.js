import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import {
  priceLabel,
  timeAgo,
  leadStatusMeta,
  LEAD_STATUSES,
  PLACEHOLDER_IMG,
} from '@/lib/format';

function StatTile({ icon, label, value, tint }) {
  return (
    <div className="card stat-card shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div className="stat-icon" style={{ background: tint.bg, color: tint.fg }}>
          <i className={`bi bi-${icon}`} />
        </div>
        <div>
          <div className="stat-value">{value}</div>
          <div className="text-secondary small">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <DashboardShell active="overview">
      {({ agent }) => <Overview agent={agent} />}
    </DashboardShell>
  );
}

function Overview({ agent }) {
  const [properties, setProperties] = useState(null);
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    setProperties(null);
    setLeads(null);
    fetch(`/api/properties?agentId=${agent.id}`)
      .then((r) => r.json())
      .then((d) => setProperties(d.properties));
    fetch(`/api/leads?agentId=${agent.id}`)
      .then((r) => r.json())
      .then((d) => setLeads(d.leads));
  }, [agent.id]);

  if (!properties || !leads) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-brand" role="status" />
      </div>
    );
  }

  const active = properties.filter((p) => p.status === 'active');
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const newLeads = leads.filter((l) => l.status === 'new');
  const closed = leads.filter((l) => l.status === 'closed');
  const propertyById = Object.fromEntries(properties.map((p) => [p.id, p]));

  const pipeline = LEAD_STATUSES.map((s) => ({
    ...s,
    count: leads.filter((l) => l.status === s.value).length,
  }));

  return (
    <>
      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <StatTile
            icon="houses"
            label="Active Listings"
            value={active.length}
            tint={{ bg: 'rgba(37, 99, 235, 0.12)', fg: '#2563eb' }}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatTile
            icon="eye"
            label="Total Listing Views"
            value={totalViews.toLocaleString('en-IN')}
            tint={{ bg: 'rgba(13, 148, 136, 0.12)', fg: '#0d9488' }}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatTile
            icon="person-plus"
            label="New Leads"
            value={newLeads.length}
            tint={{ bg: 'rgba(217, 119, 6, 0.12)', fg: '#d97706' }}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatTile
            icon="trophy"
            label="Deals Closed"
            value={closed.length}
            tint={{ bg: 'rgba(22, 163, 74, 0.12)', fg: '#16a34a' }}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">Lead Pipeline</h6>
            <Link href="/dashboard/leads" className="small">
              Manage leads <i className="bi bi-arrow-right" />
            </Link>
          </div>
          <div className="row g-2 text-center">
            {pipeline.map((s) => (
              <div className="col-4 col-md-2" key={s.value}>
                <div className="border rounded-3 py-3">
                  <div className="fs-4 fw-bold">{s.count}</div>
                  <span className={`badge text-bg-${s.badge} fw-normal`}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Recent Leads</h6>
                <Link href="/dashboard/leads" className="small">
                  View all <i className="bi bi-arrow-right" />
                </Link>
              </div>
              {leads.length === 0 ? (
                <p className="text-secondary mb-0">No leads yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <tbody>
                      {leads.slice(0, 5).map((lead) => {
                        const meta = leadStatusMeta(lead.status);
                        const prop = propertyById[lead.propertyId];
                        return (
                          <tr key={lead.id}>
                            <td>
                              <div className="fw-semibold">{lead.name}</div>
                              <div className="small text-secondary text-truncate" style={{ maxWidth: 220 }}>
                                {prop ? prop.title : `Property #${lead.propertyId}`}
                              </div>
                            </td>
                            <td>
                              <span className={`badge text-bg-${meta.badge} fw-normal`}>
                                {meta.label}
                              </span>
                            </td>
                            <td className="text-secondary small text-end">
                              {timeAgo(lead.createdAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Top Listings</h6>
                <Link href="/dashboard/properties" className="small">
                  Manage <i className="bi bi-arrow-right" />
                </Link>
              </div>
              {active.length === 0 ? (
                <p className="text-secondary mb-0">
                  No active listings. <Link href="/dashboard/properties/form">Add one</Link>.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {[...active]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((p) => (
                      <div className="d-flex gap-3 align-items-center" key={p.id}>
                        <img
                          src={p.images[0] || PLACEHOLDER_IMG}
                          alt={p.title}
                          className="rounded"
                          style={{ width: 64, height: 48, objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = PLACEHOLDER_IMG;
                          }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <Link
                            href={`/properties/${p.id}`}
                            className="fw-semibold small text-decoration-none text-dark d-block text-truncate"
                          >
                            {p.title}
                          </Link>
                          <span className="text-secondary small">
                            {priceLabel(p)} · {p.views} views
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
