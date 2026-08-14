import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV_LINKS = [
  { href: '/#overview', label: 'Project' },
  { href: '/#masterplan', label: 'Masterplan' },
  { href: '/#units', label: 'Availability' },
  { href: '/#gallery', label: 'Gallery' },
  { href: '/#location', label: 'Location' },
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
            <span className="brand-symbol"><i className="bi bi-tree" /></span>
            <span><strong>Aurelia Greens</strong><small>VILLAS & RESIDENCES</small></span>
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
                <Link href="/#enquire" className="btn btn-brand btn-sm rounded-pill px-3">Book a site visit</Link>
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
                <span className="brand-symbol"><i className="bi bi-tree" /></span>
                <span><strong>Aurelia Greens</strong><small>VILLAS & RESIDENCES</small></span>
              </div>
              <p className="footer-copy">A thoughtfully planned residential community where considered architecture, open landscapes and everyday ease come together.</p>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Explore</h6>
              <Link href="/#overview">Project</Link><Link href="/#units">Available units</Link><Link href="/#gallery">Gallery</Link>
            </div>
            <div className="col-6 col-lg-2">
              <h6>Visit</h6>
              <Link href="/#location">Location</Link><Link href="/#enquire">Book a tour</Link><a href="tel:+919840012345">Call sales</a>
            </div>
            <div className="col-lg-3">
              <h6>Sales lounge</h6>
              <p className="mb-1">Saravanampatti, Coimbatore</p>
              <a href="mailto:hello@aureliagreens.in">hello@aureliagreens.in</a>
            </div>
          </div>
          <div className="footer-base"><span>© {new Date().getFullYear()} Aurelia Greens</span><span>RERA No. TN/11/Building/0421/2026</span></div>
        </div>
      </footer>
    </div>
  );
}
