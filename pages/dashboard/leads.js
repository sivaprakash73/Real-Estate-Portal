import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { LEAD_STATUSES, leadStatusMeta, timeAgo } from '@/lib/format';

export default function DashboardLeads() {
  return (
    <DashboardShell active="leads">
      {({ agents }) => <Leads agents={agents} />}
    </DashboardShell>
  );
}

const INTEREST_LABELS = {
  'site-visit': 'Site visit',
  callback: 'Callback',
  info: 'More info',
};

function Leads({ agents }) {
  const [leads, setLeads] = useState(null);
  const [properties, setProperties] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((d) => setLeads(d.leads));
    fetch('/api/properties')
      .then((r) => r.json())
      .then((d) => setProperties(d.properties));
  }, []);

  useEffect(() => {
    setLeads(null);
    setExpandedId(null);
    load();
  }, [load]);

  async function setStatus(lead, status) {
    setBusyId(lead.id);
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    load();
  }

  async function saveNotes(lead) {
    setBusyId(lead.id);
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: noteDraft }),
    });
    setBusyId(null);
    setExpandedId(null);
    load();
  }

  async function assign(lead, agentId) {
    setBusyId(lead.id);
    await fetch(`/api/leads/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: agentId ? Number(agentId) : null }),
    });
    setBusyId(null);
    load();
  }

  async function remove(lead) {
    if (!window.confirm(`Delete lead from "${lead.name}"?`)) return;
    setBusyId(lead.id);
    await fetch(`/api/leads/${lead.id}`, { method: 'DELETE' });
    setBusyId(null);
    load();
  }

  if (!leads) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-brand" role="status" />
      </div>
    );
  }

  const propertyById = Object.fromEntries(properties.map((p) => [p.id, p]));

  const visible = leads.filter((l) => {
    if (statusFilter && l.status !== statusFilter) return false;
    if (search) {
      const hay = `${l.name} ${l.phone} ${l.email} ${l.message}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const counts = LEAD_STATUSES.map((s) => ({
    ...s,
    count: leads.filter((l) => l.status === s.value).length,
  }));

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h6 className="fw-bold mb-0">
            Enquiries <span className="text-secondary fw-normal">({leads.length})</span>
          </h6>
          <div className="d-flex gap-2">
            <input
              className="form-control form-control-sm"
              style={{ width: 220 }}
              placeholder="Search name, phone, message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select form-select-sm w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {counts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({s.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-secondary mb-0 py-4 text-center">
            {leads.length === 0
              ? 'No leads yet. Enquiries from your listings will appear here.'
              : 'No leads match the current filter.'}
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Contact / owner</th>
                  <th>Property</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => {
                  const meta = leadStatusMeta(lead.status);
                  const prop = propertyById[lead.propertyId];
                  const expanded = expandedId === lead.id;
                  return (
                    <FragmentRow key={lead.id}>
                      <tr>
                        <td style={{ minWidth: 180 }}>
                          <div className="fw-semibold">{lead.name}</div>
                          <div className="small text-secondary">
                            <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="text-decoration-none">
                              {lead.phone}
                            </a>
                            {lead.email && (
                              <>
                                {' · '}
                                <a href={`mailto:${lead.email}`} className="text-decoration-none">
                                  {lead.email}
                                </a>
                              </>
                            )}
                          </div>
                          <select
                            className="form-select form-select-sm mt-2"
                            style={{ width: 170 }}
                            value={lead.agentId || ''}
                            disabled={busyId === lead.id}
                            onChange={(e) => assign(lead, e.target.value)}
                            aria-label={`Sales owner for ${lead.name}`}
                          >
                            <option value="">Unassigned</option>
                            {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                          </select>
                        </td>
                        <td style={{ maxWidth: 220 }}>
                          {prop ? (
                            <Link
                              href={`/properties/${prop.id}`}
                              className="small text-decoration-none d-block text-truncate"
                            >
                              {prop.title}
                            </Link>
                          ) : (
                            <span className="small text-secondary">
                              Property #{lead.propertyId}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge text-bg-light border fw-normal">
                            {INTEREST_LABELS[lead.interest] || lead.interest}
                          </span>
                        </td>
                        <td>
                          <select
                            className={`form-select form-select-sm border-${meta.badge} w-auto`}
                            value={lead.status}
                            disabled={busyId === lead.id}
                            onChange={(e) => setStatus(lead, e.target.value)}
                            aria-label={`Status for ${lead.name}`}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-secondary small">{timeAgo(lead.createdAt)}</td>
                        <td className="text-end" style={{ minWidth: 110 }}>
                          <div className="btn-group btn-group-sm">
                            <button
                              className={`btn btn-outline-secondary ${expanded ? 'active' : ''}`}
                              title="Message & notes"
                              onClick={() => {
                                setExpandedId(expanded ? null : lead.id);
                                setNoteDraft(lead.notes || '');
                              }}
                            >
                              <i className="bi bi-journal-text" />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              title="Delete lead"
                              disabled={busyId === lead.id}
                              onClick={() => remove(lead)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={6} className="bg-light">
                            <div className="row g-3 p-2">
                              <div className="col-md-6">
                                <div className="small text-secondary text-uppercase fw-semibold mb-1">
                                  Enquiry message
                                </div>
                                <p className="small mb-0">
                                  {lead.message || <em className="text-secondary">No message</em>}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <div className="small text-secondary text-uppercase fw-semibold mb-1">
                                  Agent notes
                                </div>
                                <textarea
                                  className="form-control form-control-sm"
                                  rows={2}
                                  value={noteDraft}
                                  onChange={(e) => setNoteDraft(e.target.value)}
                                  placeholder="Add follow-up notes…"
                                />
                                <button
                                  className="btn btn-brand btn-sm mt-2"
                                  disabled={busyId === lead.id}
                                  onClick={() => saveNotes(lead)}
                                >
                                  Save notes
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </FragmentRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// <>…</> can't take a key inside a map, so use an explicit fragment wrapper.
function FragmentRow({ children }) {
  return <>{children}</>;
}
