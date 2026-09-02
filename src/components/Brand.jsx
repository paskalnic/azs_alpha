/** Logo + nom + baseline. Utilisé dans l'en-tête et le pied de page. */
export default function Brand({ brand, as = 'a', className = '', style }) {
  const Tag = as;
  const linkProps =
    as === 'a' ? { href: brand.href, 'aria-label': brand.ariaLabel } : {};

  return (
    <Tag className={`brand ${className}`.trim()} style={style} {...linkProps}>
      <span className="dot" aria-hidden="true" />
      <span>
        {brand.name}
        <small>{brand.tagline}</small>
      </span>
    </Tag>
  );
}
