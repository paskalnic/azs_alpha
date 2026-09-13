/**
 * Emplacement média — image, GIF ou vidéo.
 *
 * Aucun média n'est codé en dur dans les composants : chaque emplacement est
 * décrit dans les données et reste vide tant qu'aucune source n'est fournie.
 * Un back-office n'aura donc qu'à renseigner `src` (et `kind`) sur l'objet
 * correspondant pour remplir la zone, sans toucher au code.
 *
 * Forme attendue dans les données :
 *   { id, kind: 'image' | 'video', src: null, alt: '', poster: null,
 *     ratio: '4/5', label: 'Portrait de la formatrice' }
 */
export default function MediaSlot({ media, className = '', ...rest }) {
  if (!media) return null;

  const { id, kind = 'image', src, alt = '', poster, ratio, label } = media;
  /* Avec un ratio, la hauteur se déduit de la largeur : appliquer en plus
     `height:100%` créerait une boucle (contenu plus haut → ratio réclamant
     plus de largeur → largeur minimale démesurée). Sans ratio, l'emplacement
     remplit son conteneur, qui porte alors ses propres dimensions. */
  const style = ratio ? { aspectRatio: ratio } : undefined;
  const fit = ratio ? 'w-full' : 'h-full w-full';

  /* — emplacement vide : réservation visuelle, sans contenu factice — */
  if (!src) {
    return (
      <div
        data-media-slot={id}
        data-media-state="empty"
        role="presentation"
        style={style}
        className={`grid ${fit} place-items-center overflow-hidden rounded-[inherit]
                    bg-gradient-to-br from-mint to-cream-2 text-center ${className}`}
        {...rest}
      >
        {label && (
          <span className="px-4 text-[.78rem] font-semibold uppercase tracking-[.12em] text-coral-ink/55">
            {label}
          </span>
        )}
      </div>
    );
  }

  if (kind === 'video') {
    return (
      <video
        data-media-slot={id}
        data-media-state="filled"
        src={src}
        poster={poster || undefined}
        style={style}
        className={`${fit} object-cover ${className}`}
        muted
        loop
        playsInline
        autoPlay
        aria-label={alt || undefined}
        {...rest}
      />
    );
  }

  return (
    <img
      data-media-slot={id}
      data-media-state="filled"
      src={src}
      alt={alt}
      width={media.width || undefined}
      height={media.height || undefined}
      loading={media.eager ? 'eager' : 'lazy'}
      /* L’image marquee `eager` est le LCP de la page : la demander en
         priorite haute evite qu’elle passe derriere le CSS et les polices. */
      fetchpriority={media.eager ? 'high' : undefined}
      style={style}
      className={`${fit} object-cover ${className}`}
      {...rest}
    />
  );
}

/** Fabrique un emplacement vide, à remplir plus tard. */
export const emptyMedia = (id, label, extra = {}) => ({
  id,
  kind: 'image',
  src: null,
  alt: '',
  label,
  ...extra,
});
