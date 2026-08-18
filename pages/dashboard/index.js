import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { formatINRCompact, normalizeUnitStatus, timeAgo, unitCode, unitStatusMeta } from '@/lib/format';

function Stat({ icon, label, value, note, color }) {
  return <div className="card stat-card h-100"><div className="card-body">
    <div className="d-flex justify-content-between align-items-start mb-3"><span className="stat-icon" style={{ background: `${color}18`, color }}><i className={`bi bi-${icon}`} /></span><span className="mini-trend"><i className="bi bi-arrow-up-short" /> 8.4%</span></div>
    <div className="stat-value">{value}</div><div className="text-secondary small">{label}</div><div className="text-secondary mt-2" style={{ fontSize: '.65rem' }}>{note}</div>
  </div></div>;
}

export default function DashboardOverview() {
  return <DashboardShell active="overview">{({ agents }) => <Overview agents={agents} />}</DashboardShell>;
}

function Overview({ agents }) {
  const [units, setUnits] = useState(null);
  const [leads, setLeads] = useState(null);
  useEffect(() => {
    Promise.all([fetch('/api/properties').then((r) => r.json()), fetch('/api/leads').then((r) => r.json())])
      .then(([u, l]) => { setUnits((u.properties || []).map((x) => ({ ...x, status: normalizeUnitStatus(x.status) }))); setLeads(l.leads || []); });
  }, []);
  if (!units || !leads) return <div className="text-center py-5"><div className="spinner-border text-brand" /></div>;

  const counts = Object.fromEntries(['available','reserved','sold'].map((s) => [s, units.filter((u) => u.status === s).length]));
  const inventoryValue = units.reduce((sum, u) => sum + Number(u.price || 0), 0);
  const recent = leads.slice(0, 5);
  const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));
  const leadColors = { new: '#4776b8', contacted: '#5499a5', 'site-visit': '#d3a04e', negotiation: '#866c9b', closed: '#4f8d61', lost: '#b46a61' };
  const pipeline = ['new','contacted','site-visit','negotiation','closed'].map((status) => ({ status, count: leads.filter((l) => l.status === status).length }));

  return <>
    <div className="dashboard-greeting d-flex flex-wrap justify-content-between align-items-end gap-2 mb-4">
      <div><h2 className="h3 mb-1">Good morning.</h2><p className="text-secondary mb-0 small">Here&apos;s what&apos;s happening across Vetrivelan Realty today.</p></div>
      <span className="small text-secondary"><i className="bi bi-calendar3 me-2" />14 August 2026</span>
    </div>
    <div className="row g-3">
      <div className="col-sm-6 col-xl-3"><Stat icon="bounding-box" label="Available units" value={counts.available} note={`${counts.reserved} currently reserved`} color="#39755f" /></div>
      <div className="col-sm-6 col-xl-3"><Stat icon="chat-left-text" label="Total enquiries" value={leads.length} note={`${leads.filter((l) => l.status === 'new').length} need a first response`} color="#4776b8" /></div>
      <div className="col-sm-6 col-xl-3"><Stat icon="calendar2-check" label="Site visits" value={leads.filter((l) => l.interest === 'site-visit').length} note="Across all sales advisors" color="#b98239" /></div>
      <div className="col-sm-6 col-xl-3"><Stat icon="currency-rupee" label="Inventory value" value={formatINRCompact(inventoryValue)} note={`${counts.sold} units sold to date`} color="#8065a0" /></div>
    </div>

    <div className="row g-3 mt-1">
      <div className="col-xl-8"><div className="card h-100"><div className="card-body p-4">
        <div className="d-flex justify-content-between mb-4"><div><h6 className="fw-bold mb-1">Sales pipeline</h6><span className="text-secondary small">Enquiries moving through each stage</span></div><Link href="/dashboard/leads" className="small text-decoration-none">Manage enquiries <i className="bi bi-arrow-right" /></Link></div>
        <div className="pipeline-track mb-4">{pipeline.map((p) => <span key={p.status} style={{ width: `${Math.max((p.count / Math.max(leads.length,1)) * 100, 2)}%`, background: leadColors[p.status] }} />)}</div>
        <div className="row g-2">{pipeline.map((p) => <div className="col" key={p.status}><div className="border-start ps-3"><small className="text-secondary text-capitalize">{p.status.replace('-', ' ')}</small><div className="h4 mb-0 mt-1">{p.count}</div></div></div>)}</div>
      </div></div></div>
      <div className="col-xl-4"><div className="card h-100"><div className="card-body p-4">
        <div className="d-flex justify-content-between mb-4"><div><h6 className="fw-bold mb-1">Inventory mix</h6><span className="text-secondary small">Live project status</span></div><Link href="/dashboard/properties" className="small text-decoration-none">View all</Link></div>
        {['available','reserved','sold'].map((status) => { const meta = unitStatusMeta(status); const pct = Math.round((counts[status] / Math.max(units.length,1)) * 100); return <div className="mb-3" key={status}><div className="d-flex justify-content-between small mb-1"><span><i className={`legend-${status} d-inline-block rounded-circle me-2`} style={{ width: 8, height: 8 }} />{meta.label}</span><strong>{counts[status]} <span className="text-secondary fw-normal">({pct}%)</span></strong></div><div className="progress" style={{ height: 6 }}><div className="progress-bar" style={{ width: `${pct}%`, background: status === 'available' ? '#5b8e79' : status === 'reserved' ? '#d3a04e' : '#a7aaa6' }} /></div></div>; })}
      </div></div></div>
    </div>

    <div className="card mt-3"><div className="card-body p-0"><div className="d-flex justify-content-between align-items-center p-4 pb-2"><div><h6 className="fw-bold mb-1">Recent enquiries</h6><span className="text-secondary small">Latest conversations requiring attention</span></div><Link href="/dashboard/leads" className="btn btn-outline-secondary btn-sm">View all</Link></div>
      <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr className="small text-secondary"><th className="ps-4">Customer</th><th>Unit</th><th>Assigned to</th><th>Received</th><th>Status</th></tr></thead><tbody>{recent.map((lead) => { const unit = units.find((u) => u.id === lead.propertyId); return <tr key={lead.id}><td className="ps-4"><strong className="small">{lead.name}</strong><div className="text-secondary" style={{ fontSize: '.67rem' }}>{lead.phone}</div></td><td className="small">{unit ? unitCode(unit) : '—'}</td><td className="small">{agentById[lead.agentId]?.name || 'Unassigned'}</td><td className="small text-secondary">{timeAgo(lead.createdAt)}</td><td><span className={`badge fw-normal text-bg-${lead.status === 'new' ? 'primary' : lead.status === 'closed' ? 'success' : 'light'}`}>{lead.status.replace('-', ' ')}</span></td></tr>; })}</tbody></table></div>
    </div></div>
  </>;
}
