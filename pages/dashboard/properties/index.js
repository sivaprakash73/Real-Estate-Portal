import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DashboardShell from '@/components/DashboardShell';
import { formatINRCompact, normalizeUnitStatus, UNIT_STATUSES, unitCode, unitStatusMeta } from '@/lib/format';

export default function DashboardProperties() {
  return <DashboardShell active="listings">{({ agents }) => <Inventory agents={agents} />}</DashboardShell>;
}

function Inventory({ agents }) {
  const [units, setUnits] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [busyId, setBusyId] = useState(null);
  const load = useCallback(() => fetch('/api/properties').then((r) => r.json()).then((d) => setUnits((d.properties || []).map((u) => ({ ...u, status: normalizeUnitStatus(u.status) })))), []);
  useEffect(() => { load(); }, [load]);

  async function update(unit, patch) {
    setBusyId(unit.id);
    await fetch(`/api/properties/${unit.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    setBusyId(null); load();
  }
  async function remove(unit) {
    if (!window.confirm(`Delete ${unitCode(unit)}? This cannot be undone.`)) return;
    setBusyId(unit.id); await fetch(`/api/properties/${unit.id}`, { method: 'DELETE' }); setBusyId(null); load();
  }
  const visible = useMemo(() => (units || []).filter((u) => {
    if (status && u.status !== status) return false;
    return `${unitCode(u)} ${u.title} ${u.type} ${u.locality}`.toLowerCase().includes(search.toLowerCase());
  }), [units, search, status]);
  const agentById = Object.fromEntries(agents.map((a) => [a.id, a]));

  if (!units) return <div className="text-center py-5"><div className="spinner-border text-brand" /></div>;
  return <>
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
      <div><h2 className="h5 fw-bold mb-1">Project inventory</h2><p className="small text-secondary mb-0">Manage pricing, ownership and live availability for every unit.</p></div>
      <Link href="/dashboard/properties/form" className="btn btn-brand btn-sm"><i className="bi bi-plus-lg me-1" /> Add plot / unit</Link>
    </div>
    <div className="row g-3 mb-3">{UNIT_STATUSES.map((s) => <div className="col-4" key={s.value}><button className={`card w-100 text-start ${status === s.value ? 'border-brand' : ''}`} onClick={() => setStatus(status === s.value ? '' : s.value)}><div className="card-body py-3"><div className="d-flex justify-content-between align-items-center"><span className={`unit-status status-${s.value}`}><i />{s.label}</span><strong className="h4 mb-0">{units.filter((u) => u.status === s.value).length}</strong></div></div></button></div>)}</div>
    <div className="card"><div className="card-body p-0">
      <div className="p-3 border-bottom d-flex flex-wrap justify-content-between gap-2"><div className="input-group input-group-sm" style={{ maxWidth: 320 }}><span className="input-group-text bg-white"><i className="bi bi-search" /></span><input className="form-control border-start-0" placeholder="Search unit, type or location" value={search} onChange={(e) => setSearch(e.target.value)} /></div><span className="small text-secondary align-self-center">Showing {visible.length} of {units.length} units</span></div>
      <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr className="small text-secondary"><th className="ps-4">Unit</th><th>Type & area</th><th>Price</th><th>Status</th><th>Sales owner</th><th>Visibility</th><th className="text-end pe-4">Actions</th></tr></thead><tbody>
        {visible.map((unit) => { const meta = unitStatusMeta(unit.status); return <tr key={unit.id}>
          <td className="ps-4"><strong>{unitCode(unit)}</strong><div className="text-secondary text-truncate" style={{ fontSize: '.67rem', maxWidth: 230 }}>{unit.title}</div></td>
          <td><span className="small">{unit.type}</span><div className="text-secondary" style={{ fontSize: '.67rem' }}>{unit.area.toLocaleString('en-IN')} sq.ft</div></td><td><strong className="small">{formatINRCompact(unit.price)}</strong></td>
          <td><select className={`form-select form-select-sm border-${meta.badge}`} style={{ width: 120 }} value={unit.status} disabled={busyId === unit.id} onChange={(e) => update(unit, { status: e.target.value })}>{UNIT_STATUSES.map((s) => <option value={s.value} key={s.value}>{s.label}</option>)}</select></td>
          <td><select className="form-select form-select-sm" style={{ width: 155 }} value={unit.agentId || ''} disabled={busyId === unit.id} onChange={(e) => update(unit, { agentId: Number(e.target.value) })}>{agents.map((a) => <option value={a.id} key={a.id}>{a.name}</option>)}</select><span className="visually-hidden">{agentById[unit.agentId]?.name}</span></td>
          <td><button className={`btn btn-sm ${unit.featured ? 'btn-success' : 'btn-outline-secondary'}`} title="Toggle featured" onClick={() => update(unit, { featured: !unit.featured })}><i className={`bi bi-${unit.featured ? 'eye' : 'eye-slash'}`} /></button></td>
          <td className="text-end pe-4"><div className="btn-group btn-group-sm"><Link href={`/properties/${unit.id}`} className="btn btn-outline-secondary" title="View public page"><i className="bi bi-box-arrow-up-right" /></Link><Link href={`/dashboard/properties/form?id=${unit.id}`} className="btn btn-outline-secondary" title="Edit"><i className="bi bi-pencil" /></Link><button className="btn btn-outline-danger" title="Delete" disabled={busyId === unit.id} onClick={() => remove(unit)}><i className="bi bi-trash" /></button></div></td>
        </tr>; })}
      </tbody></table></div>
      {!visible.length && <div className="text-center py-5 text-secondary"><i className="bi bi-search fs-3 d-block mb-2" />No units match these filters.</div>}
    </div></div>
  </>;
}
