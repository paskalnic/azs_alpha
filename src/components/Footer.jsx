import Brand from './Brand';
import QualiopiBadge from './QualiopiBadge';

/**
 * Pied de page — migré en utilitaires Tailwind.
 * La classe `foot` est conservée : elle sert de crochet aux deux règles
 * CSS qui habillent le composant Brand (non migré) en version sombre.
 *
 * WRAP : `word-break` et non `overflow-wrap` (le `break-words` de Tailwind).
 * Seul `word-break: break-word` réduit la taille min-content de l'e-mail ;
 * sans lui la colonne s'élargit et la grille dérive du 1.5fr/1fr/1fr d'origine.
 */
const WRAP = '[word-break:break-word]';

export default function Footer({ brand, footer }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot grid gap-[2.2rem] foot:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Brand brand={brand} as="div" style={{ fontSize: '1.2rem' }} />
            <p className="mb-[1.1rem] max-w-[34ch] text-foot-text">{footer.description}</p>
            <div className="foot-q mt-[1.2rem] flex items-center gap-[.8rem]">
              <QualiopiBadge label={footer.qualiopi.badge} />
              <span className="max-w-[26ch] text-[.76rem] text-foot-text">
                {footer.qualiopi.text}
              </span>
            </div>
          </div>

          <div>
            <FootTitle>{footer.contact.title}</FootTitle>
            {footer.contact.lines.map((line) => (
              <div
                className="mb-[.6rem] flex items-baseline gap-[.55rem] text-foot-link"
                key={line.label}
              >
                <b className="min-w-16 shrink-0 text-[.78rem] font-semibold text-foot-dim">
                  {line.label}
                </b>
                {line.href ? (
                  <a
                    href={line.href}
                    className={`text-foot-link hover:text-white${line.wrap ? ` ${WRAP}` : ''}`}
                  >
                    {line.value}
                  </a>
                ) : (
                  <span>{line.value}</span>
                )}
              </div>
            ))}
          </div>

          <div>
            <FootTitle>{footer.links.title}</FootTitle>
            <ul className="flex list-none flex-col gap-[.6rem]">
              {footer.links.items.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-foot-link hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-x-7 gap-y-3 border-t border-white/12 pt-6 text-[.8rem] text-foot-dim">
          <span>
            © {year} {footer.legalNotice}
          </span>
          <nav aria-label={footer.legalNavLabel} className="flex flex-wrap gap-5">
            {/* pas de couleur propre : ces liens héritent du gris de la barre,
                comme dans la maquette où `.foot a` ne les atteint pas */}
            {footer.legalLinks.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FootTitle({ children }) {
  return (
    <h4 className="mb-4 font-body text-[.72rem] font-bold uppercase tracking-[.13em] text-sun">
      {children}
    </h4>
  );
}
