import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Brand from './Brand';
import Button from './Button';
import SmartLink from './SmartLink';
import { scrollToAnchor } from '../lib/anchorScroll';

/**
 * En-tête collant avec navigation adaptative.
 *
 * Sous 860 px, la barre de liens laisse place à un menu dépliant : la maquette
 * masquait la navigation sans rien proposer à la place, ce qui privait les
 * visiteurs mobiles de tout accès aux pages.
 */
export default function Header({ brand, nav }) {
  const [open, setOpen] = useState(false);
  const [jumpTo, setJumpTo] = useState(null);
  const panelRef = useRef(null);
  const burgerRef = useRef(null);
  const { pathname, hash } = useLocation();

  // toute navigation referme le menu
  useEffect(() => setOpen(false), [pathname, hash]);

  /* Pendant l'ouverture, le menu s'efface de lui-même : Échap, un geste de
     défilement, ou un appui hors du panneau. Le document n'est plus figé —
     `overflow:hidden` sur <body> ne laissait au visiteur tactile que le bouton
     du burger pour s'en sortir, et un geste de défilement, réflexe premier
     devant un panneau qu'on ne veut plus, ne produisait rien du tout. */
  useEffect(() => {
    if (!open) return undefined;

    const close = () => setOpen(false);
    const onKey = (e) => e.key === 'Escape' && close();

    /* Le repli de la barre d'adresse des navigateurs mobiles émet lui aussi un
       `scroll` : on n'y réagit qu'au-delà d'un vrai déplacement. */
    const from = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - from) > 8 && close();

    const onPointerDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      // Le burger porte déjà la bascule : la doubler ici rouvrirait aussitôt.
      if (burgerRef.current?.contains(e.target)) return;
      close();
      /* Ce geste-là ne sert qu'à refermer. On l'empêche d'activer le lien qui
         se trouve dessous — en capture, donc avant React —, sans rien bloquer
         d'autre. Le minuteur le retire si aucun clic ne suit, par exemple
         quand l'appui n'était que le début d'un défilement. */
      const swallow = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      document.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => document.removeEventListener('click', swallow, { capture: true }), 320);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    // `preventScroll` : sans lui, la mise au point ferait défiler la page, ce
    // que le guetteur ci-dessus prendrait pour un geste et refermerait aussitôt.
    panelRef.current?.querySelector('a')?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  /* Rejoint la section une fois le panneau refermé. Déclaré après l'effet
     ci-dessus : React exécute son nettoyage — donc la levée du verrou de
     défilement — avant le corps de celui-ci. */
  useEffect(() => {
    if (open || !jumpTo) return undefined;
    setJumpTo(null);
    const target = document.getElementById(jumpTo);
    if (!target) return undefined;
    // L'ancre reste dans l'URL : elle est partageable et survit au rechargement.
    window.history.replaceState(null, '', `#${jumpTo}`);
    return scrollToAnchor(target);
  }, [open, jumpTo]);

  /**
   * Le panneau fige le défilement du document tant qu'il est ouvert. Laisser
   * le navigateur traiter l'ancre à cet instant revient à sauter dans une page
   * verrouillée : rien ne bouge, et comme React Router n'écoute que `popstate`
   * — jamais `hashchange` — un lien d'ancre natif ne lui parvenait pas, donc le
   * menu ne se refermait pas non plus. D'où le « il faut cliquer deux fois ».
   * On retient la cible, on ferme, et on saute ensuite.
   */
  const onPanelClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    setOpen(false);

    const id = (link.getAttribute('href') || '').split('#')[1];
    // Cible absente de cette page : c'est une vraie navigation, on laisse faire.
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    setJumpTo(id);
  };

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
          ref={burgerRef}
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
          l'arbre d'accessibilité comme de l'affichage. Il ne reprend pas
          l'appel à l'action : sous 860 px, la barre fixe du bas (MobileDock)
          l'affiche déjà en permanence, menu ouvert compris. */}
      <div
        id="menu-mobile"
        ref={panelRef}
        className="nav-panel"
        hidden={!open}
        onClick={onPanelClick}
      >
        <nav aria-label={nav.ariaLabel}>
          {nav.links.map((l) => (
            <SmartLink key={l.href + l.label} href={l.href}>
              {l.label}
            </SmartLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
