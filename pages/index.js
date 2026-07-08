import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropertyCard from '@/components/PropertyCard';
import { listProperties, listAgents } from '@/lib/store';
import { CITIES, PROPERTY_TYPES } from '@/lib/format';

export async function getServerSideProps() {
  const featured = listProperties({ featured: true, status: 'active' }).slice(0, 6);
  const all = listProperties({});
  const stats = {
    listings: all.filter((p) => p.status === 'active').length,
    cities: new Set(all.map((p) => p.city)).size,
    agents: listAgents().length,
  };
  return { props: { featured, stats } };
}

export default function Home({ featured, stats }) {
  const router = useRouter();
  const [search, setSearch] = useState({
    listingType: 'sale',
    city: '',
    type: '',
    maxPrice: '',
  });

  function submit(e) {
    e.preventDefault();
    const query = Object.fromEntries(
      Object.entries(search).filter(([, v]) => v !== '')
    );
    router.push({ pathname: '/properties', query });
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="row justify-content-center text-center mb-4">
            <div className="col-lg-8">
              <h1 className="display-5 fw-bold">Find a place you&apos;ll love to live</h1>
              <p className="lead opacity-75">
                Verified listings across {stats.cities} cities in South India —
                buy, rent, or invest with trusted local agents.
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card search-card shadow-lg border-0">
                <div className="card-body p-4">
                  <ul className="nav nav-pills mb-3">
                    {[
                      { value: 'sale', label: 'Buy' },
                      { value: 'rent', label: 'Rent' },
                    ].map((t) => (
                      <li className="nav-item" key={t.value}>
                        <button
                          type="button"
                          className={`nav-link ${
                            search.listingType === t.value ? 'active btn-brand' : 'text-dark'
                          }`}
                          style={
                            search.listingType === t.value
                              ? { background: 'var(--brand)' }
                              : undefined
                          }
                          onClick={() =>
                            setSearch((s) => ({ ...s, listingType: t.value }))
                          }
                        >
                          {t.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form className="row g-2" onSubmit={submit}>
                    <div className="col-md-4">
                      <select
                        className="form-select form-select-lg"
                        value={search.city}
                        onChange={(e) => setSearch((s) => ({ ...s, city: e.target.value }))}
                      >
                        <option value="">All Cities</option>
                        {CITIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select form-select-lg"
                        value={search.type}
                        onChange={(e) => setSearch((s) => ({ ...s, type: e.target.value }))}
                      >
                        <option value="">All Types</option>
                        {PROPERTY_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-select form-select-lg"
                        value={search.maxPrice}
                        onChange={(e) =>
                          setSearch((s) => ({ ...s, maxPrice: e.target.value }))
                        }
                      >
                        <option value="">Any Budget</option>
                        {search.listingType === 'sale' ? (
                          <>
                            <option value={5000000}>Under ₹50 L</option>
                            <option value={10000000}>Under ₹1 Cr</option>
                            <option value={20000000}>Under ₹2 Cr</option>
                            <option value={50000000}>Under ₹5 Cr</option>
                          </>
                        ) : (
                          <>
                            <option value={25000}>Under ₹25k/mo</option>
                            <option value={50000}>Under ₹50k/mo</option>
                            <option value={100000}>Under ₹1 L/mo</option>
                            <option value={300000}>Under ₹3 L/mo</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="col-md-2 d-grid">
                      <button className="btn btn-warning btn-lg fw-semibold">
                        <i className="bi bi-search me-1" />
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center mt-4 text-center">
            <div className="col-auto px-4">
              <div className="fs-3 fw-bold">{stats.listings}+</div>
              <div className="small opacity-75">Active Listings</div>
            </div>
            <div className="col-auto px-4 border-start border-light border-opacity-25">
              <div className="fs-3 fw-bold">{stats.cities}</div>
              <div className="small opacity-75">Cities</div>
            </div>
            <div className="col-auto px-4 border-start border-light border-opacity-25">
              <div className="fs-3 fw-bold">{stats.agents}</div>
              <div className="small opacity-75">Expert Agents</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <h2 className="section-title mb-1">Featured Properties</h2>
            <p className="text-secondary mb-0">Hand-picked homes across South India</p>
          </div>
          <Link href="/properties" className="btn btn-outline-brand">
            View All
            <i className="bi bi-arrow-right ms-2" />
          </Link>
        </div>
        <div className="row g-4">
          {featured.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-5">
        <div className="container">
          <h2 className="section-title text-center mb-2">Browse by City</h2>
          <p className="text-secondary text-center mb-4">
            Explore properties in the city you want to call home
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {CITIES.map((c) => (
              <Link
                key={c}
                href={{ pathname: '/properties', query: { city: c } }}
                className="btn btn-outline-brand rounded-pill px-4"
              >
                <i className="bi bi-buildings me-2" />
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-patch-check" />
            </div>
            <h5 className="fw-bold">Verified Listings</h5>
            <p className="text-secondary">
              Every property is verified by our team — clear titles, real photos,
              honest pricing.
            </p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-people" />
            </div>
            <h5 className="fw-bold">Trusted Local Agents</h5>
            <p className="text-secondary">
              Work with experienced agents who know your neighbourhood inside out.
            </p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon mb-3">
              <i className="bi bi-calculator" />
            </div>
            <h5 className="fw-bold">Plan Your Loan</h5>
            <p className="text-secondary">
              Use our EMI calculator to understand exactly what your dream home
              will cost each month.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand text-white py-5">
        <div className="container text-center">
          <h3 className="fw-bold mb-2">Wondering what your EMI would be?</h3>
          <p className="opacity-75 mb-4">
            Estimate your monthly payments with our free home loan calculator.
          </p>
          <Link href="/calculator" className="btn btn-warning btn-lg fw-semibold px-4">
            <i className="bi bi-calculator me-2" />
            Try the EMI Calculator
          </Link>
        </div>
      </section>
    </>
  );
}
