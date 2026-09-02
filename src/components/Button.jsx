import SmartLink from './SmartLink';

/**
 * Bouton / lien d'action. `variant` : 'primary' | 'ghost'. `size` : 'lg' | undefined.
 * Rend un <a> si `href` est fourni, sinon un <button>.
 */
export default function Button({
  href,
  label,
  children,
  variant = 'primary',
  size,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className]
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
