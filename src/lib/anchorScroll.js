/**
 * Rejoint une ancre, et se recale si la page a bougé en chemin.
 *
 * Le défilement doux vise une position calculée à l'instant du départ, puis
 * l'anime pendant plusieurs centaines de millisecondes. Or la page continue de
 * vivre pendant ce temps : polices qui arrivent, images qui se chargent,
 * carrousel qui se remesure. Quelques centaines de pixels d'écart suffisent à
 * dépasser complètement la section visée — c'est ainsi qu'un lien
 * « Financement » déposait le visiteur sur le bloc suivant.
 *
 * On vérifie donc, une fois l'animation finie, où la cible a réellement
 * atterri, et on corrige. La réserve de hauteur vient de `scroll-padding-top`
 * sur <html>, seule source de vérité pour l'en-tête collant.
 */
const TOLERANCE = 4; // px d'écart en deçà desquels on ne touche à rien
const SETTLE_MS = 420; // laisse le défilement doux se terminer
const RECHECK_MS = 140;
const MAX_TRIES = 4;

export function scrollToAnchor(target) {
  if (!target) return () => {};

  target.scrollIntoView();

  let tries = 0;
  let timer = 0;

  const stop = () => {
    clearTimeout(timer);
    // Ne plus rien corriger dès que le visiteur reprend la main : le recalage
    // doit rattraper la page, jamais contrarier un geste.
    window.removeEventListener('wheel', stop, { passive: true });
    window.removeEventListener('touchstart', stop, { passive: true });
    window.removeEventListener('keydown', stop);
  };

  const check = () => {
    const headroom =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const drift = target.getBoundingClientRect().top - headroom;

    if (Math.abs(drift) <= TOLERANCE || tries >= MAX_TRIES) return stop();

    tries += 1;
    // Correction sèche : le visiteur a déjà vu le trajet, le rejouer en douceur
    // ne ferait que prolonger le flottement.
    window.scrollBy({ top: drift, behavior: 'auto' });
    timer = setTimeout(check, RECHECK_MS);
  };

  window.addEventListener('wheel', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop);
  timer = setTimeout(check, SETTLE_MS);

  return stop;
}
