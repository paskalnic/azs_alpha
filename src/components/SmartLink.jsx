import { Link, useLocation } from 'react-router-dom';

/**
 * Choisit le bon élément selon la destination :
 * navigation interne via <Link> (sans rechargement), et <a> natif pour les
 * ancres, mailto:, tel: et liens externes.
 */
export default function SmartLink({ href, children, ...rest }) {
  const { pathname } = useLocation();

  // « /#contact » depuis l'accueil : simple ancre, sans rechargement
  if (href?.startsWith('/#') && pathname === '/') {
    return (
      <a href={href.slice(1)} {...rest}>
        {children}
      </a>
    );
  }

  const isRoute = href?.startsWith('/') && !href.startsWith('/#');
  if (isRoute) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
