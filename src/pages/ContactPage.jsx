import PageLayout from '../components/PageLayout';
import Breadcrumb from '../components/Breadcrumb';
import Reveal from '../components/Reveal';
import MediaSlot from '../components/MediaSlot';
import Button from '../components/Button';
import { useHead } from '../seo/HeadProvider';
import { breadcrumbLd, organizationLd } from '../seo/jsonld';
import { CONTACT_PAGE } from '../data/pagesData';
import { SITE, formatAddress } from '../site.config';

const MAP_QUERY = encodeURIComponent(
  `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.region}`,
);

export default function ContactPage() {
  const crumbs = [
    { label: 'Accueil', path: '/' },
    { label: CONTACT_PAGE.title, path: CONTACT_PAGE.path },
  ];
  useHead({
    path: CONTACT_PAGE.path,
    title: CONTACT_PAGE.title,
    description: CONTACT_PAGE.summary,
    jsonLd: [breadcrumbLd(crumbs), organizationLd()],
  });

  const details = [
    { label: 'Téléphone', value: SITE.contact.phone, href: SITE.contact.phoneHref },
    { label: 'E-mail', value: SITE.contact.email, href: `mailto:${SITE.contact.email}` },
    { label: 'Adresse', value: formatAddress(SITE.address) },
    { label: 'Horaires', value: SITE.contact.hours },
  ];

  return (
    <PageLayout>
      <section className="sec">
        <div className="wrap">
          <Breadcrumb items={crumbs} />

          <div className="grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-start">
            <Reveal>
              <span className="eyebrow">Parlons de votre projet</span>
              <h1 className="mb-5 mt-3 max-w-[14ch]">{CONTACT_PAGE.title}</h1>
              <p className="lead mb-9">{CONTACT_PAGE.intro}</p>

              <dl className="mb-9 grid gap-6 sm:grid-cols-2">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="mb-1 text-[.72rem] font-bold uppercase tracking-[.13em] text-coral-ink">
                      {d.label}
                    </dt>
                    <dd className="font-display text-[1.05rem] font-semibold text-ink">
                      {d.href ? (
                        <a href={d.href} className="hover:text-coral-ink hover:underline">
                          {d.value}
                        </a>
                      ) : (
                        d.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Sous 860 px, la barre fixe du bas (MobileDock) porte déjà ces
                  deux actions : on ne les affiche qu'à partir du moment où elle
                  disparaît. */}
              <div className="hidden flex-wrap gap-[.85rem] nav:flex">
                <Button href={SITE.contact.quoteHref} label="Demander un devis" variant="primary" size="lg" />
                <Button href={SITE.contact.phoneHref} label={`📞 ${SITE.contact.phone}`} variant="ghost" size="lg" />
              </div>

              <p className="text-[.86rem] text-muted nav:mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-teal hover:underline"
                >
                  Ouvrir l'adresse dans Google Maps ↗
                </a>
              </p>
            </Reveal>

            <Reveal className="rounded-[var(--radius)] border border-rule bg-paper p-7 shadow-[var(--shadow-soft)]">
              <MediaSlot
                media={{
                  id: 'contact-portrait',
                  kind: 'image',
                  src: null,
                  alt: '',
                  ratio: '4/3',
                  label: 'Portrait ou vue du centre',
                }}
                className="mb-6 rounded-[18px]"
              />
              <h2 className="mb-4 font-display text-[1.3rem]">{CONTACT_PAGE.about.title}</h2>
              {CONTACT_PAGE.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="mb-4 text-[.94rem] text-muted last:mb-0">
                  {p}
                </p>
              ))}
              <p className="mt-6 border-t border-rule pt-5 text-[.9rem]">
                <b className="font-display">{SITE.founder.name}</b>
                <span className="block text-muted">{SITE.founder.role}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
