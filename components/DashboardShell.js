import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const NAV = [
  { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'grid-1x2' },
  { key: 'listings', label: 'Plots & units', href: '/dashboard/properties', icon: 'bounding-box-circles' },
  { key: 'leads', label: 'Enquiries', href: '/dashboard/leads', icon: 'chat-square-text' },
  { key: 'team', label: 'Sales team', href: '/dashboard/team', icon: 'people' },
  { key: 'reports', label: 'Reports', href: '/dashboard/reports', icon: 'bar-chart-line' },
];

export default function DashboardShell({ active, children }) {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => setAgents(d.agents || []));
  }, []);

  return (
    <>
      <Head><title>Admin dashboard | Aurelia Greens</title></Head>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/" className="admin-brand text-decoration-none">
            <span className="admin-brand-mark"><i className="bi bi-tree" /></span>
            <span><strong>Aurelia</strong><small>PROJECT ADMIN</small></span>
          </Link>

          <nav className="admin-nav" aria-label="Admin navigation">
            <span className="admin-nav-label">Workspace</span>
            {NAV.map((item) => (
              <Link key={item.key} href={item.href} className={`admin-nav-link ${active === item.key ? 'active' : ''}`}>
                <i className={`bi bi-${item.icon}`} /><span>{item.label}</span>
              </Link>
            ))}
            <span className="admin-nav-label mt-4">Website</span>
            <Link href="/" className="admin-nav-link">
              <i className="bi bi-box-arrow-up-right" /><span>View public site</span>
            </Link>
          </nav>

          <div className="admin-user">
            <span className="admin-user-avatar">AM</span>
            <span><strong>Arjun Mehta</strong><small>Administrator</small></span>
            <i className="bi bi-three-dots ms-auto" />
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <div>
              <span className="text-secondary small">Aurelia Greens</span>
              <h1>{NAV.find((item) => item.key === active)?.label || 'Dashboard'}</h1>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="icon-button" aria-label="Notifications">
                <i className="bi bi-bell" /><span className="notification-dot" />
              </button>
              <Link href="/dashboard/properties/form" className="btn btn-brand btn-sm px-3">
                <i className="bi bi-plus-lg me-1" /> Add unit
              </Link>
            </div>
          </header>
          <div className="admin-content">
            {agents.length ? children({ agent: agents[0], agents }) : (
              <div className="text-center py-5"><div className="spinner-border text-brand" /></div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
