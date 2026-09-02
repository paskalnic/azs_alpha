import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd } from '../seo/jsonld';

/** Identifiant d'ancre stable, dérivé du titre de section. */
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

/**
 * Gabarit commun aux pages légales.
 *
 * Le texte est contractuel : il est rendu tel quel, sans réécriture.
 * Un sommaire est généré à partir des titres de section — ces documents
 * sont longs et on y cherche un article précis plus qu'on ne les lit.
 */
export default function LegalPage({ page }) {
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: page.title, path: page.path },
  ];

  useHead({
    path: page.path,
    title: page.seoTitle || page.title,
    description: page.summary,
    jsonLd: breadcrumbLd(crumbs),
  });

  const sections = page.blocks
    .filter((b) => b.tag === 'h2')
    .map((b) => ({ id: slugify(b.text), label: b.text }));

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />

          <h1 className="mb-10 max-w-[20ch] text-[clamp(2rem,1.5rem+2.2vw,3.2rem)]">
            {page.title}
          </h1>

          <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
            {sections.length > 2 && (
              <nav aria-label="Sommaire" className="lg:sticky lg:top-28">
                <h2 className="mb-4 text-[.72rem] font-bold uppercase tracking-[.13em] text-coral-ink">
                  Sommaire
                </h2>
                <ol className="flex flex-col gap-2 border-l border-rule pl-4">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-[.86rem] leading-snug text-muted hover:text-coral-ink hover:underline"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* `anywhere` et non `break-word` : seul le premier réduit la
                largeur minimale du bloc, ce qui empêche une URL insécable
                d'élargir la colonne sur les petits écrans. */}
            <article className="max-w-[72ch] [overflow-wrap:anywhere]">
              {page.blocks.map((b, i) =>
                b.tag === 'h2' ? (
                  <h2
                    key={i}
                    id={slugify(b.text)}
                    className="mb-4 mt-11 scroll-mt-28 font-display text-[1.25rem] first:mt-0"
                  >
                    {b.text}
                  </h2>
                ) : b.tag === 'h3' || b.tag === 'h4' ? (
                  <h3 key={i} className="mb-3 mt-7 text-[1.05rem]">
                    {b.text}
                  </h3>
                ) : b.tag === 'li' ? (
                  <p key={i} className="mb-2 flex items-baseline gap-[.55rem] text-[.95rem]">
                    <span aria-hidden="true" className="shrink-0 text-coral">
                      —
                    </span>
                    <span>{b.text}</span>
                  </p>
                ) : (
                  <p key={i} className="mb-4 text-[.95rem] leading-relaxed text-muted">
                    {b.text}
                  </p>
                ),
              )}
            </article>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
