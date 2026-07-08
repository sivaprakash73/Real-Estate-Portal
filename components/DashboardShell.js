import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { PLACEHOLDER_IMG } from '@/lib/format';

const TABS = [
  { key: 'overview', label: 'Overview', href: '/dashboard', icon: 'speedometer2' },
  { key: 'listings', label: 'My Listings', href: '/dashboard/properties', icon: 'houses' },
  { key: 'leads', label: 'Leads', href: '/dashboard/leads', icon: 'people' },
];

// Wraps every dashboard page: loads agents, remembers the selected agent
// (demo stand-in for authentication) and renders children({ agent, agents }).
export default function DashboardShell({ active, children }) {
  const [agents, setAgents] = useState([]);
  const [agentId, setAgentId] = useState(null);

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.json())
      .then((d) => {
        setAgents(d.agents);
        const stored = Number(localStorage.getItem('agentId'));
        const valid = d.agents.some((a) => a.id === stored);
        setAgentId(valid ? stored : d.agents[0]?.id ?? null);
      });
  }, []);

  function switchAgent(id) {
    localStorage.setItem('agentId', String(id));
    setAgentId(id);
  }

  const agent = agents.find((a) => a.id === agentId);

  return (
    <>
      <Head>
        <title>Agent Dashboard — PrimeNest</title>
      </Head>
      <div className="bg-white border-bottom">
        <div className="container py-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              {agent && (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="avatar-sm"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER_IMG;
                  }}
                />
              )}
              <div>
                <h1 className="h5 fw-bold mb-0">Agent Dashboard</h1>
                <span className="text-secondary small">
                  {agent ? `${agent.name} · ${agent.specialization}` : 'Loading…'}
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="text-secondary small mb-0" htmlFor="agentSwitch">
                Viewing as
              </label>
              <select
                id="agentSwitch"
                className="form-select form-select-sm w-auto"
                value={agentId ?? ''}
                onChange={(e) => switchAgent(Number(e.target.value))}
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="nav nav-tabs border-0 mt-3">
            {TABS.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <Link
                  href={tab.href}
                  className={`nav-link ${active === tab.key ? 'active fw-semibold' : 'text-secondary'}`}
                >
                  <i className={`bi bi-${tab.icon} me-1`} />
                  {tab.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container py-4">
        {agent ? (
          children({ agent, agents })
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-brand" role="status" />
            <p className="text-secondary mt-3">Loading dashboard…</p>
          </div>
        )}
      </div>
    </>
  );
}
