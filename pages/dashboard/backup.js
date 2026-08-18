import { useRef, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';

export default function DashboardBackup() {
  return <DashboardShell active="backup">{() => <BackupManager />}</DashboardShell>;
}

function BackupManager() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function restore() {
    if (!file) return;
    if (!window.confirm('Restore this backup? It will replace all current listings, enquiries and sales-team data.')) return;

    setBusy(true);
    setStatus(null);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backup),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to restore this backup.');
      setStatus({ type: 'success', text: `${result.message} ${result.counts.properties} listings and ${result.counts.leads} enquiries restored.` });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      setStatus({ type: 'danger', text: error.message || 'Please choose a valid backup file.' });
    } finally {
      setBusy(false);
    }
  }

  return <div className="row g-4">
    <div className="col-lg-7">
      <div className="card h-100"><div className="card-body p-4">
        <span className="backup-icon mb-3"><i className="bi bi-cloud-arrow-down" /></span>
        <h2 className="h5 fw-bold">Download a backup</h2>
        <p className="text-secondary small mb-4">Save a complete copy of your listings, customer enquiries and sales team as a JSON file. Keep this file somewhere private and secure.</p>
        <a href="/api/backup" className="btn btn-brand">
          <i className="bi bi-download me-2" />Download backup
        </a>
      </div></div>
    </div>

    <div className="col-lg-5">
      <div className="card h-100"><div className="card-body p-4">
        <span className="backup-icon backup-icon-warn mb-3"><i className="bi bi-cloud-arrow-up" /></span>
        <h2 className="h5 fw-bold">Restore a backup</h2>
        <p className="text-secondary small">Choose a backup previously downloaded from this dashboard.</p>
        <input ref={inputRef} className="form-control form-control-sm mb-3" type="file" accept="application/json,.json" onChange={(event) => {
          setFile(event.target.files?.[0] || null);
          setStatus(null);
        }} />
        <button className="btn btn-outline-danger" disabled={!file || busy} onClick={restore}>
          {busy ? <><span className="spinner-border spinner-border-sm me-2" />Restoring…</> : <><i className="bi bi-arrow-counterclockwise me-2" />Restore selected backup</>}
        </button>
      </div></div>
    </div>

    <div className="col-12">
      {status && <div className={`alert alert-${status.type} mb-0`} role="alert">{status.text}</div>}
      <div className="backup-note mt-3"><i className="bi bi-shield-exclamation" /><span><strong>Important:</strong> restoring overwrites the current local data. Download a fresh backup before restoring any older file. Protect the dashboard and <code>/api/backup</code> with authentication before publishing the site.</span></div>
    </div>
  </div>;
}
