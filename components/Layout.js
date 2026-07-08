import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/agents', label: 'Agents' },
  { href: '/calculator', label: 'EMI Calculator' },
];

export default function Layout({ children }) {
  const router = useRouter();

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-brand sticky-top shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold fs-4">
            <i className="bi bi-houses-fill me-2" />
            PrimeNest
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              {NAV_LINKS.map((link) => (
                <li className="nav-item" key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-link ${isActive(link.href) ? 'active fw-semibold' : ''}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link href="/dashboard" className="btn btn-warning btn-sm fw-semibold px-3">
                  <i className="bi bi-speedometer2 me-1" />
                  Agent Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">{children}</main>

      <footer className="bg-dark text-light pt-5 pb-4 mt-auto">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold">
                <i className="bi bi-houses-fill me-2" />
                PrimeNest
              </h5>
              <p className="text-secondary mb-2">
                Buy, sell and rent properties across South India. Verified
                listings, trusted agents, and honest advice.
              </p>
              <p className="text-secondary small mb-0">
                <i className="bi bi-geo-alt me-1" />
                Chennai · Bangalore · Coimbatore · Hyderabad · Kochi · Madurai
              </p>
            </div>
            <div className="col-6 col-lg-2 offset-lg-1">
              <h6 className="text-uppercase small fw-bold text-secondary">Explore</h6>
              <ul className="list-unstyled">
                <li><Link href="/properties?listingType=sale" className="footer-link">Buy</Link></li>
                <li><Link href="/properties?listingType=rent" className="footer-link">Rent</Link></li>
                <li><Link href="/agents" className="footer-link">Find an Agent</Link></li>
                <li><Link href="/calculator" className="footer-link">EMI Calculator</Link></li>
              </ul>
            </div>
            <div className="col-6 col-lg-2">
              <h6 className="text-uppercase small fw-bold text-secondary">For Agents</h6>
              <ul className="list-unstyled">
                <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link href="/dashboard/leads" className="footer-link">Leads</Link></li>
                <li><Link href="/dashboard/properties" className="footer-link">My Listings</Link></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h6 className="text-uppercase small fw-bold text-secondary">Contact</h6>
              <ul className="list-unstyled text-secondary">
                <li><i className="bi bi-telephone me-2" />+91 44 4200 1234</li>
                <li><i className="bi bi-envelope me-2" />hello@primenest.in</li>
              </ul>
            </div>
          </div>
          <hr className="border-secondary" />
          <p className="text-secondary small mb-0 text-center">
            © {new Date().getFullYear()} PrimeNest Realty. Demo application — listings are sample data.
          </p>
        </div>
      </footer>
    </div>
  );
}
