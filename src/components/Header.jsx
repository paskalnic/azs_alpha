import Brand from './Brand';
import Button from './Button';

export default function Header({ brand, nav }) {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <Brand brand={brand} />
        <nav className="nav-links" aria-label={nav.ariaLabel}>
          {nav.links.map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <Button href={nav.cta.href} label={nav.cta.label} variant="primary" className="nav-cta" />
      </div>
    </header>
  );
}
