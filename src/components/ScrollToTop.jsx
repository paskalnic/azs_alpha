import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToAnchor } from '../lib/anchorScroll';

/**
 * Remet la page en haut à chaque changement de route — le comportement attendu
 * d'une navigation entre pages, que le routeur ne fait pas de lui-même.
 * Si l'URL porte une ancre, on laisse la cible reprendre la main.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Même recalage que depuis le menu : une page qui vient de changer bouge
    // encore sous le défilement (images, polices, carrousel).
    if (hash) return scrollToAnchor(document.getElementById(hash.slice(1)));
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);

  return null;
}
