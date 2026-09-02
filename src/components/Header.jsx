import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';
import Button from './Button';
import SmartLink from './SmartLink';

/**
 * En-tête collant avec navigation adaptative.
 *
 * Sous 860 px, la barre de liens laisse place à un menu dépliant : la maquette
 * masquait la navigation sans rien proposer à la place, ce qui privait les
 * visiteurs mobiles de tout accès aux pages.
 */
export default function Header({ brand, nav }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { pathname, hash } = useLocation();

  // toute navigation referme le menu
  useEffect(() => setOpen(false), [pathname, hash]);

  // pendant l'ouverture : défilement bloqué et fermeture à l'Échap
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Brand brand={brand} />

        <nav className="nav-links" aria-label={nav.ariaLabel}>
          {nav.links.map((l) => (
            <SmartLink key={l.href + l.label} href={l.href}>
              {l.label}
            </SmartLink>
          ))}
        </nav>

        <Button href={nav.cta.href} label={nav.cta.label} variant="primary" className="nav-cta" />

        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav-burger-icon${open ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Le panneau reste dans le DOM : `hidden` suffit à le retirer de
          l'arbre d'accessibilité comme de l'affichage. */}
      <div id="menu-mobile" ref={panelRef} className="nav-panel" hidden={!open}>
        <nav aria-label={nav.ariaLabel}>
          {nav.links.map((l) => (
            <SmartLink key={l.href + l.label} href={l.href}>
              {l.label}
            </SmartLink>
          ))}
        </nav>
        <Button
          href={nav.cta.href}
          label={nav.cta.label}
          variant="primary"
          size="lg"
          className="w-full justify-center"
        />
      </div>
    </header>
  );
}
