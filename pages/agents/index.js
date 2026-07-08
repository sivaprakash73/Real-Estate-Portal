import Head from 'next/head';
import Link from 'next/link';
import { listAgents, listProperties } from '@/lib/store';
import { PLACEHOLDER_IMG } from '@/lib/format';

export async function getServerSideProps() {
  const agents = listAgents().map((a) => ({
    ...a,
    activeListings: listProperties({ agentId: a.id, status: 'active' }).length,
  }));
  return { props: { agents } };
}

export default function Agents({ agents }) {
  return (
    <>
      <Head>
        <title>Our Agents — PrimeNest</title>
      </Head>
      <section className="bg-brand text-white py-5">
        <div className="container text-center">
          <h1 className="h2 fw-bold">Meet Our Agents</h1>
          <p className="opacity-75 mb-0">
            Local experts who will guide you from first visit to final registration.
          </p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          {agents.map((agent) => (
            <div className="col-md-6 col-lg-3" key={agent.id}>
              <div className="card border-0 shadow-sm h-100 text-center property-card">
                <div className="card-body p-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="avatar-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMG;
                    }}
                  />
                  <h5 className="fw-bold mb-0">{agent.name}</h5>
                  <div className="text-secondary small mb-2">{agent.agency}</div>
                  <span className="badge text-bg-light border fw-normal mb-3">
                    {agent.specialization}
                  </span>
                  <div className="d-flex justify-content-center gap-4 small mb-3">
                    <span>
                      <i className="bi bi-star-fill text-warning me-1" />
                      {agent.rating}
                    </span>
                    <span className="text-secondary">{agent.deals} deals</span>
                    <span className="text-secondary">
                      Since {agent.since}
                    </span>
                  </div>
                  <p className="text-secondary small">{agent.about}</p>
                </div>
                <div className="card-footer bg-white border-0 pb-4 d-grid gap-2">
                  <Link
                    href={{ pathname: '/properties', query: { agentId: agent.id } }}
                    className="btn btn-brand btn-sm"
                  >
                    <i className="bi bi-houses me-2" />
                    View {agent.activeListings} Listing{agent.activeListings !== 1 && 's'}
                  </Link>
                  <a
                    href={`tel:${agent.phone.replace(/\s/g, '')}`}
                    className="btn btn-outline-brand btn-sm"
                  >
                    <i className="bi bi-telephone me-2" />
                    {agent.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
