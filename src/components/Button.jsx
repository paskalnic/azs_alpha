import SmartLink from './SmartLink';

/**
 * Bouton / lien d'action. `variant` : 'primary' | 'ghost'. `size` : 'lg' | undefined.
 * Rend un <a> si `href` est fourni, sinon un <button>.
 *
 * `dockDuplicate` marque une action que la barre fixe du bas (MobileDock)
 * porte déjà : elle disparaît alors de la page sous 860 px, où elle ferait
 * doublon, et reste entière au-delà, où cette barre n'existe pas.
 */
export default function Button({
  href,
  label,
  children,
  variant = 'primary',
  size,
  dockDuplicate = false,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size ? `btn-${size}` : '',
    dockDuplicate ? 'btn-dock-duplicate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const content = children ?? label;

  if (href) {
    return (
      <SmartLink href={href} className={classes} {...rest}>
        {content}
      </SmartLink>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
