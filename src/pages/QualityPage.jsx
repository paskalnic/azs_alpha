import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import Reveal from '../components/Reveal';
import QualiopiBadge from '../components/QualiopiBadge';
import FinalCta from '../components/FinalCta';
import { Link } from 'react-router-dom';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd } from '../seo/jsonld';
import { QUALITY, RESULTS } from '../data/pagesData';
import { landingData } from '../data/landingData';
import { SITE } from '../site.config';

export default function QualityPage() {
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: QUALITY.title, path: QUALITY.path },
  ];
  useHead({
    path: QUALITY.path,
    title: QUALITY.title,
    description: QUALITY.summary,
    jsonLd: breadcrumbLd(crumbs),
  });

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <Reveal>
              <span className="eyebrow">Démarche qualité</span>
              <h1 className="mb-5 mt-3 max-w-[16ch]">{QUALITY.title}</h1>
              <p className="lead">{QUALITY.intro}</p>
            </Reveal>
            <Reveal className="flex items-center gap-5 rounded-[var(--radius)] border border-rule bg-paper p-6 shadow-[var(--shadow-soft)]">
              <QualiopiBadge label={SITE.certification.name} />
              <p className="text-[.92rem] text-muted">
                <b className="text-ink">Certifié {SITE.certification.name}</b> au titre des actions
                de formation. {SITE.certification.label}
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {QUALITY.pillars.map((p) => (
              <Reveal key={p.title} className="border-t-[3px] border-t-coral pt-4">
                <h2 className="mb-2 font-display text-[1.05rem]">{p.title}</h2>
                <p className="text-[.92rem] text-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>

          <h2 className="mb-8 mt-16 font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)]">
            Nos engagements, en détail
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {QUALITY.commitments.map((c) => (
              <Reveal
                key={c.title}
                className="rounded-[var(--radius)] border border-rule bg-paper p-6 shadow-[var(--shadow-soft)]"
              >
                <h3 className="mb-4 text-[1.05rem]">{c.title}</h3>
                <ul className="flex flex-col gap-[.55rem]">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-baseline gap-[.55rem] text-[.92rem]">
                      <span aria-hidden="true" className="shrink-0 text-coral">
                        —
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 rounded-[var(--radius)] bg-cream-2 p-8 text-center">
            <p className="mb-5 text-muted">
              Nos indicateurs de résultats sont publiés et mis à jour chaque année.
            </p>
            <Link to={RESULTS.path} className="btn btn-ghost">
              Voir nos résultats
            </Link>
          </Reveal>
        </div>
      </section>

      <FinalCta finalCta={landingData.finalCta} />
    </PageLayout>
  );
}
