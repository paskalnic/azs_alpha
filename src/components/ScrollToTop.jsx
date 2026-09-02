import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Remet la page en haut à chaque changement de route — le comportement attendu
 * d'une navigation entre pages, que le routeur ne fait pas de lui-même.
 * Si l'URL porte une ancre, on laisse la cible reprendre la main.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
