import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import Reveal from '../components/Reveal';
import FinalCta from '../components/FinalCta';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd } from '../seo/jsonld';
import { RESULTS } from '../data/pagesData';
import { landingData } from '../data/landingData';

export default function ResultsPage() {
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: RESULTS.title, path: RESULTS.path },
  ];
  useHead({
    path: RESULTS.path,
    title: RESULTS.title,
    description: RESULTS.summary,
    jsonLd: breadcrumbLd(crumbs),
  });

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />

          <Reveal className="sec-head">
            <span className="eyebrow">Année {RESULTS.period}</span>
            <h1>{RESULTS.title}</h1>
            <p>{RESULTS.intro}</p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {RESULTS.indicators.map((ind) => (
              <Reveal
                key={ind.label}
                className="rounded-[var(--radius)] border border-rule bg-paper p-7 text-center shadow-[var(--shadow-soft)]"
              >
                <div className="font-display text-[clamp(2.4rem,2rem+1.6vw,3.2rem)] font-bold leading-none text-teal">
                  {ind.value}
                </div>
                <h2 className="mb-2 mt-4 font-display text-[1.05rem]">{ind.label}</h2>
                <p className="text-[.86rem] text-muted">{ind.note}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8 max-w-[62ch]">
            <p className="text-muted">{RESULTS.note}</p>
            <p className="mt-5 text-[.84rem] text-muted">
              Dernière mise à jour : {RESULTS.updatedAt}.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta finalCta={landingData.finalCta} />
    </PageLayout>
  );
}
