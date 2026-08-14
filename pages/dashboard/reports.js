import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { formatINRCompact, normalizeUnitStatus } from '@/lib/format';

export default function ReportsPage() {
  return <DashboardShell active="reports">{() => <Reports />}</DashboardShell>;
}

function Reports() {
  const [units, setUnits] = useState(null); const [leads, setLeads] = useState(null);
  useEffect(() => { Promise.all([fetch('/api/properties').then((r) => r.json()), fetch('/api/leads').then((r) => r.json())]).then(([u,l]) => { setUnits((u.properties || []).map((x) => ({...x,status:normalizeUnitStatus(x.status)}))); setLeads(l.leads || []); }); }, []);
  if (!units || !leads) return <div className="text-center py-5"><div className="spinner-border text-brand" /></div>;
  const sold = units.filter((u) => u.status === 'sold'); const soldValue = sold.reduce((s,u) => s + Number(u.price || 0), 0); const conversion = leads.length ? Math.round((leads.filter((l) => l.status === 'closed').length / leads.length) * 100) : 0;
  const months = ['Mar','Apr','May','Jun','Jul','Aug']; const values = [5,8,6,11,14,Math.max(7,leads.length)]; const max = Math.max(...values);
  const source = [{label:'Website enquiry',value:46,color:'#315e51'},{label:'WhatsApp',value:28,color:'#6f998d'},{label:'Walk-in / referral',value:17,color:'#c19a61'},{label:'Campaigns',value:9,color:'#a9aaa5'}];
  function exportCsv() {
    const rows = [['Metric','Value'],['Total units',units.length],['Available units',units.filter((u) => u.status === 'available').length],['Reserved units',units.filter((u) => u.status === 'reserved').length],['Sold units',sold.length],['Total enquiries',leads.length],['Conversion rate',`${conversion}%`],['Sales value',soldValue]];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'aurelia-greens-report.csv'; anchor.click(); URL.revokeObjectURL(url);
  }
  return <>
    <div className="d-flex flex-wrap justify-content-between gap-2 mb-4"><div><h2 className="h5 fw-bold mb-1">Sales & inventory reports</h2><p className="small text-secondary mb-0">A concise view of project performance and buyer demand.</p></div><div className="d-flex gap-2"><span className="form-control form-control-sm bg-white text-secondary">Last 6 months</span><button className="btn btn-outline-secondary btn-sm" onClick={exportCsv}><i className="bi bi-download me-1" /> Export</button></div></div>
    <div className="row g-3 mb-3"><div className="col-sm-6 col-xl-3"><Metric label="Sales value" value={formatINRCompact(soldValue)} note={`${sold.length} units sold`} /></div><div className="col-sm-6 col-xl-3"><Metric label="Lead conversion" value={`${conversion}%`} note="Enquiry to booking" /></div><div className="col-sm-6 col-xl-3"><Metric label="Average ticket" value={formatINRCompact(soldValue / Math.max(sold.length,1))} note="Across sold inventory" /></div><div className="col-sm-6 col-xl-3"><Metric label="Site visit intent" value={leads.filter((l) => l.interest === 'site-visit').length} note="Qualified prospects" /></div></div>
    <div className="row g-3"><div className="col-lg-8"><div className="card h-100"><div className="card-body p-4"><div><h6 className="fw-bold mb-1">Enquiry trend</h6><span className="small text-secondary">New enquiries received by month</span></div><div className="report-chart">{months.map((month,i) => <div className="report-bar-wrap" key={month}><strong className="small">{values[i]}</strong><div className="report-bar" style={{ height: `${(values[i]/max)*82}%` }} /><small>{month}</small></div>)}</div></div></div></div>
      <div className="col-lg-4"><div className="card h-100"><div className="card-body p-4"><h6 className="fw-bold mb-1">Lead sources</h6><span className="small text-secondary">Where project demand comes from</span><div className="mt-4">{source.map((s) => <div className="mb-3" key={s.label}><div className="d-flex justify-content-between small mb-1"><span>{s.label}</span><strong>{s.value}%</strong></div><div className="progress" style={{height:7}}><div className="progress-bar" style={{width:`${s.value}%`,background:s.color}} /></div></div>)}</div></div></div></div>
    </div>
    <div className="card mt-3"><div className="card-body p-4"><div className="row align-items-center"><div className="col-md-4"><h6 className="fw-bold">Inventory health</h6><p className="small text-secondary mb-md-0">Current status across all {units.length} project units.</p></div>{['available','reserved','sold'].map((status) => { const count=units.filter((u)=>u.status===status).length; return <div className="col-4 col-md text-center" key={status}><strong className="h3 d-block mb-0">{count}</strong><small className="text-secondary text-capitalize">{status}</small></div>; })}</div></div></div>
  </>;
}

function Metric({label,value,note}) { return <div className="card h-100"><div className="card-body p-4"><span className="small text-secondary">{label}</span><div className="h3 fw-bold mt-2 mb-1">{value}</div><small className="text-secondary">{note}</small></div></div>; }
