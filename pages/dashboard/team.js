import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { PLACEHOLDER_IMG } from '@/lib/format';

export default function TeamPage() {
  return <DashboardShell active="team">{({ agents }) => <Team agents={agents} />}</DashboardShell>;
}

function Team({ agents }) {
  const [units, setUnits] = useState([]);
  const [leads, setLeads] = useState([]);
  useEffect(() => { Promise.all([fetch('/api/properties').then((r) => r.json()), fetch('/api/leads').then((r) => r.json())]).then(([u,l]) => { setUnits(u.properties || []); setLeads(l.leads || []); }); }, []);
  return <>
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4"><div><h2 className="h5 fw-bold mb-1">Sales team</h2><p className="small text-secondary mb-0">Monitor ownership, workload and conversion across the project team.</p></div><a href="mailto:?subject=Invitation%20to%20Aurelia%20Greens%20sales%20workspace" className="btn btn-brand btn-sm"><i className="bi bi-person-plus me-1" /> Invite team member</a></div>
    <div className="row g-3">
      {agents.map((agent) => { const assignedUnits = units.filter((u) => u.agentId === agent.id); const assigned = leads.filter((l) => l.agentId === agent.id); const won = assigned.filter((l) => l.status === 'closed').length; const workload = Math.min(100, assigned.length * 9); return <div className="col-md-6 col-xl-4" key={agent.id}><div className="card h-100"><div className="card-body p-4">
        <div className="d-flex gap-3 align-items-center mb-4"><img className="team-avatar" src={agent.avatar} alt={agent.name} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} /><div className="min-w-0"><h6 className="fw-bold mb-1">{agent.name}</h6><div className="text-secondary small text-truncate">{agent.specialization}</div></div><span className="badge text-bg-success fw-normal ms-auto">Active</span></div>
        <div className="row g-2 text-center mb-4"><div className="col-4"><div className="border-end"><strong className="d-block h5 mb-0">{assigned.length}</strong><small className="text-secondary">Enquiries</small></div></div><div className="col-4"><div className="border-end"><strong className="d-block h5 mb-0">{assignedUnits.length}</strong><small className="text-secondary">Units</small></div></div><div className="col-4"><strong className="d-block h5 mb-0">{won}</strong><small className="text-secondary">Closed</small></div></div>
        <div className="d-flex justify-content-between small mb-2"><span className="text-secondary">Current workload</span><strong>{workload}%</strong></div><div className="workload-bar mb-4"><span style={{ width: `${workload}%` }} /></div>
        <div className="d-flex gap-2"><a href={`tel:${agent.phone.replace(/\s/g,'')}`} className="btn btn-outline-secondary btn-sm flex-grow-1"><i className="bi bi-telephone me-1" /> Call</a><a href={`mailto:${agent.email}`} className="btn btn-outline-secondary btn-sm flex-grow-1"><i className="bi bi-envelope me-1" /> Email</a><button className="btn btn-outline-secondary btn-sm"><i className="bi bi-three-dots" /></button></div>
      </div></div></div>; })}
    </div>
  </>;
}
