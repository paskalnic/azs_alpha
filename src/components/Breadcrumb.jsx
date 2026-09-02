import { Link } from 'react-router-dom';

/**
 * Fil d'Ariane. Le dernier élément est la page courante : il n'est pas cliquable
 * et porte aria-current, conformément aux pratiques d'accessibilité.
 * Le balisage BreadcrumbList correspondant est injecté par la page (JSON-LD).
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[.82rem] text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="hover:text-coral-ink hover:underline">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-rule">
                    ›
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
