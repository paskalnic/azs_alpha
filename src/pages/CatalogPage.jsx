import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import FormationCardLink from '../components/FormationCardLink';
import Reveal from '../components/Reveal';
import FinalCta from '../components/FinalCta';
import { Link } from 'react-router-dom';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd } from '../seo/jsonld';
import { CATEGORIES, formationsOf, FORMATIONS } from '../data/formations';
import { landingData } from '../data/landingData';

/**
 * Catalogue complet, regroupé par famille.
 * Sert les deux URL historiques /nos-formations/ et /nos-prestations/ ;
 * la seconde porte une balise canonique vers la première pour éviter
 * que deux adresses ne se concurrencent sur le même contenu.
 */
export default function CatalogPage({ path, canonicalPath, title }) {
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: 'Nos formations', path: canonicalPath || path },
  ];

  useHead({
    path: canonicalPath || path,
    title,
    description: `Les ${FORMATIONS.length} formations d'AZS Alpha Formations : anglais, français et techniques d'accueil. Organisme certifié Qualiopi à Baie-Mahault, formations finançables.`,
    jsonLd: breadcrumbLd(crumbs),
  });

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />
          <Reveal className="sec-head">
            <span className="eyebrow">Catalogue</span>
            <h1>{title}</h1>
            <p>
              Toutes nos formations sont individualisées, démarrent par un test de positionnement
              et sont finançables. Elles se déroulent en présentiel à Baie-Mahault ou à distance.
            </p>
          </Reveal>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="mb-14">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-display">{cat.title}</h2>
                <Link to={cat.path} className="more text-teal">
                  Voir la famille →
                </Link>
              </div>
              <div className="dom-grid">
                {formationsOf(cat.id).map((f) => (
                  <FormationCardLink key={f.id} formation={f} categoryModifier={cat.modifier} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <FinalCta finalCta={landingData.finalCta} />
    </PageLayout>
  );
}
