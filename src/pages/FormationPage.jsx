import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import FactList from '../components/FactList';
import MediaSlot from '../components/MediaSlot';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import { useHead } from '../seo/HeadProvider';
import { courseLd, breadcrumbLd } from '../seo/jsonld';
import { SITE } from '../site.config';
import {
  getCategory,
  formationsOf,
  certificationOf,
  FUNDING,
  ACCESS_STEPS,
  ACCESSIBILITY,
  TRAINER,
} from '../data/formations';

/** Section de contenu titrée, réutilisée pour tous les blocs de la fiche. */
function Section({ title, children }) {
  return (
    <Reveal as="section" className="mb-12">
      <h2 className="mb-5 font-display text-[clamp(1.35rem,1.1rem+.9vw,1.85rem)]">{title}</h2>
      {children}
    </Reveal>
  );
}

/** Liste à puces reprenant le tiret bleu des cartes de la page d'accueil. */
function Bullets({ items, className = '' }) {
  return (
    <ul className={`flex flex-col gap-[.55rem] ${className}`}>
      {items.map((it) => (
        <li key={it} className="flex items-baseline gap-[.55rem] text-[.95rem]">
          <span aria-hidden="true" className="shrink-0 text-coral">
            —
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default function FormationPage({ formation: f }) {
  const category = getCategory(f.category);
  const certification = certificationOf(f);
  const siblings = formationsOf(f.category).filter((s) => s.id !== f.id);

  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: category.name, path: category.path },
    { label: f.shortTitle, path: f.path },
  ];

  useHead({
    path: f.path,
    title: f.seoTitle || f.title,
    description: f.summary,
    jsonLd: [
      courseLd({ ...f, durationIso: f.duration?.iso }),
      breadcrumbLd(crumbs),
    ],
  });

  return (
    <PageLayout>
      <article className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />

          {/* — En-tête de fiche — */}
          <header className="mb-10 grid gap-8 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <Reveal>
              <span className="eyebrow">{category.title}</span>
              <h1 className="mb-4 mt-3 max-w-[18ch] text-[clamp(2rem,1.5rem+2.2vw,3.2rem)]">
                {f.title}
              </h1>
              <p className="lead">{f.intro}</p>
              <div className="mt-7 flex flex-wrap gap-[.85rem]">
                <Button href="#contact-formation" label="Demander un devis" variant="primary" size="lg" />
                <Button href={SITE.contact.phoneHref} label={`📞 ${SITE.contact.phone}`} variant="ghost" size="lg" />
              </div>
            </Reveal>
            <Reveal>
              <MediaSlot
                media={f.media}
                className="rounded-[var(--radius)] shadow-[var(--shadow-soft)]"
              />
            </Reveal>
          </header>

          <Reveal className="mb-12">
            <FactList
              facts={[
                { label: 'Durée', value: f.duration?.label },
                { label: 'Tarif', value: f.price?.label, note: f.price?.note },
                {
                  label: 'Effectif',
                  value: f.participants
                    ? f.participants.min === f.participants.max
                      ? `${f.participants.min} participant`
                      : `${f.participants.min} à ${f.participants.max} participants`
                    : 'Nous consulter',
                },
                { label: 'Modalités', value: f.modes?.join(' · ') },
              ]}
            />
          </Reveal>

          <div className="grid gap-x-14 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <Section title="Public concerné et prérequis">
                <p className="mb-3 text-muted">{f.audience}</p>
                <p className="text-muted">
                  <b className="text-ink">Prérequis : </b>
                  {f.prerequisites}
                </p>
              </Section>

              <Section title="Objectifs">
                <p className="mb-5 text-muted">{f.objectives.main}</p>
                <Bullets items={f.objectives.list} />
              </Section>

              <Section title="Programme">
                <div className="flex flex-col gap-6">
                  {f.programme.map((mod) => (
                    <div
                      key={mod.title}
                      className="rounded-[var(--radius)] border border-rule bg-paper p-6 shadow-[var(--shadow-soft)]"
                    >
                      <h3 className="mb-3 text-[1.08rem]">{mod.title}</h3>
                      <Bullets items={mod.items} />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Méthodes pédagogiques">
                <Bullets items={f.method} />
              </Section>

              <Section title="Modalités d'évaluation">
                <Bullets items={f.evaluation} />
              </Section>

              {certification && (
                <Section title={certification.name}>
                  <p className="mb-5 text-muted">{certification.summary}</p>
                  <Bullets items={certification.modalities} />
                  {certification.validity && (
                    <p className="mt-4 font-semibold text-teal">{certification.validity}</p>
                  )}
                </Section>
              )}

              <Section title="Financement">
                <div className="grid gap-4 sm:grid-cols-3">
                  {FUNDING.map((fund) => (
                    <div key={fund.id} className="border-t-[3px] border-t-coral pt-4">
                      <h3 className="mb-2 text-[1.02rem]">{fund.profile}</h3>
                      <p className="text-[.9rem] text-muted">{fund.text}</p>
                    </div>
                  ))}
                </div>
                {f.fundingExtra && (
                  <p className="mt-5 text-[.92rem] font-semibold text-teal">{f.fundingExtra}</p>
                )}
              </Section>

              <Section title="Modalités et délais d'accès">
                <ol className="mb-5 flex flex-col gap-[.55rem]">
                  {ACCESS_STEPS.map((step, i) => (
                    <li key={step} className="flex items-baseline gap-3 text-[.95rem]">
                      <span
                        aria-hidden="true"
                        className="grid size-6 shrink-0 place-items-center rounded-full bg-coral/12 text-[.75rem] font-bold text-coral-ink"
                      >
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-muted">{f.accessDelay}</p>
              </Section>

              <Section title={ACCESSIBILITY.title}>
                <p className="mb-3 text-muted">{ACCESSIBILITY.text}</p>
                <p className="text-[.9rem] font-semibold text-teal">{ACCESSIBILITY.referent}</p>
              </Section>

              <Section title={TRAINER.title}>
                <p className="text-muted">{TRAINER.text}</p>
              </Section>
            </div>

            {/* — Colonne latérale — */}
            <aside className="lg:sticky lg:top-28">
              <div
                id="contact-formation"
                className="rounded-[var(--radius)] bg-teal p-7 text-white shadow-[var(--shadow)]"
              >
                <h2 className="mb-3 font-display text-[1.3rem] text-white">
                  Cette formation vous intéresse ?
                </h2>
                <p className="mb-6 text-[.92rem] text-white/85">
                  Dites-nous où vous en êtes. Réponse sous 48 h avec une proposition et les pistes
                  de financement.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    href={SITE.contact.quoteHref}
                    label="Demander un devis"
                    variant="primary"
                    className="w-full justify-center border-white bg-white !bg-none text-coral-ink"
                  />
                  <Button
                    href={SITE.contact.phoneHref}
                    label={`📞 ${SITE.contact.phone}`}
                    variant="ghost"
                    className="w-full justify-center border-white/60 bg-transparent text-white"
                  />
                </div>
              </div>

              {siblings.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-4 font-display text-[1.1rem]">
                    Autres formations en {category.name.toLowerCase()}
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {siblings.map((s) => (
                      <li key={s.id}>
                        <Link
                          to={s.path}
                          className="block rounded-[18px] border border-rule bg-paper p-4 transition-colors hover:border-coral"
                        >
                          <span className="block font-display text-[.98rem] font-semibold text-ink">
                            {s.shortTitle}
                          </span>
                          <span className="mt-1 block text-[.84rem] text-muted">
                            {s.duration.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </PageLayout>
  );
}
