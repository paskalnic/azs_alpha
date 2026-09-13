import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import FormationCardLink from '../components/FormationCardLink';
import Reveal from '../components/Reveal';
import FinalCta from '../components/FinalCta';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd } from '../seo/jsonld';
import { formationsOf } from '../data/formations';
import { landingData } from '../data/landingData';

export default function CategoryPage({ category }) {
  const formations = formationsOf(category.id);
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: category.name, path: category.path },
  ];

  useHead({
    path: category.path,
    title: category.title,
    description: category.metaSummary,
    jsonLd: [
      breadcrumbLd(crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: category.title,
        itemListElement: formations.map((f, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: f.title,
          url: `https://azsalphaformations.com${f.path}`,
        })),
      },
    ],
  });

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />
          <Reveal className="sec-head">
            <span className="eyebrow">Nos formations</span>
            <h1>{category.title}</h1>
            <p>{category.intro}</p>
          </Reveal>

          <div className="dom-grid">
            {formations.map((f) => (
              <FormationCardLink
                key={f.id}
                formation={f}
                categoryModifier={category.modifier}
                level={2}
              />
            ))}
          </div>
        </div>
      </section>

      <FinalCta finalCta={landingData.finalCta} />
    </PageLayout>
  );
}
