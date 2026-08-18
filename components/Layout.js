import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/properties', label: 'Properties' },
  { href: '/demo', label: 'Demo' },
  { href: '/contact', label: 'Contact' },
];

export default function Layout({ children }) {
  const router = useRouter();
  const inAdmin = router.pathname.startsWith('/dashboard');

  if (inAdmin) return <>{children}</>;

  return (
    <div className="d-flex flex-column min-vh-100 public-site">
      <nav className="navbar navbar-expand-lg public-nav sticky-top">
        <div className="container">
          <Link href="/" className="navbar-brand project-brand">
            <span className="brand-symbol"><i className="bi bi-house-heart" /></span>
            <span><strong>Vetrivelan Realty</strong><small>PROPERTY CONSULTANTS</small></span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              {NAV_LINKS.map((link) => (
                <li className="nav-item" key={link.href}>
                  <Link href={link.href} className="nav-link">{link.label}</Link>
                </li>
              ))}
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link href="/contact" className="btn btn-brand btn-sm rounded-pill px-3">Talk to us</Link>
              </li>
              <li className="nav-item">
                <Link href="/dashboard" className="nav-link admin-entry" title="Admin dashboard"><i className="bi bi-person-lock" /></Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">{children}</main>

      <footer className="project-footer">
        <div className="container py-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="project-brand text-white mb-3">
                <span className="brand-symbol"><i className="bi bi-house-heart" /></span>
                <span><strong>Vetrivelan Realty</strong><small>PROPERTY CONSULTANTS</small></span>
              </div>
              <p className="footer-copy">Clear guidance and thoughtfully chosen properties for every step of your real-estate journey.</p>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Explore</h6>
              <Link href="/about">About us</Link><Link href="/services">Our services</Link><Link href="/properties">Properties</Link>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Connect</h6>
              <Link href="/contact">Contact us</Link><Link href="/properties">Browse listings</Link><Link href="/calculator">Loan calculator</Link>
            </div>
            <div className="col-lg-3">
              <h6>Service area</h6>
              <p className="mb-1">Tamil Nadu, India</p>
              <Link href="/contact">Start a conversation</Link>
            </div>
          </div>
          <div className="footer-base"><span>© {new Date().getFullYear()} Vetrivelan Realty</span><span>Property guidance made simple</span></div>
        </div>
      </footer>
    </div>
  );
}
