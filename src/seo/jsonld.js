import { SITE, formatAddress } from '../site.config';
import { canonicalUrl } from './head';

const postalAddress = (a) => ({
  '@type': 'PostalAddress',
  streetAddress: a.street,
  postalCode: a.postalCode,
  addressLocality: a.city,
  addressRegion: a.region,
  addressCountry: a.country,
});

/** Organisme de formation — à poser sur la page d'accueil. */
export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${SITE.origin}/#organization`,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.origin,
  description: SITE.description,
  email: SITE.contact.email,
  telephone: SITE.contact.phoneE164,
  address: postalAddress(SITE.address),
  founder: { '@type': 'Person', name: SITE.founder.name },
  areaServed: { '@type': 'AdministrativeArea', name: 'Guadeloupe' },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: SITE.certification.name,
    description: SITE.certification.label,
  },
});

/** Fiche formation. */
export const courseLd = (f) => {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: f.title,
    description: f.summary,
    url: canonicalUrl(f.path),
    inLanguage: 'fr',
    provider: { '@id': `${SITE.origin}/#organization` },
  };
  if (f.duration || f.modes) {
    ld.hasCourseInstance = {
      '@type': 'CourseInstance',
      courseMode: f.modes,
      ...(f.durationIso ? { courseWorkload: f.durationIso } : {}),
      location: {
        '@type': 'Place',
        name: SITE.legalName,
        address: postalAddress(SITE.address),
      },
    };
  }
  if (f.price) {
    ld.offers = {
      '@type': 'Offer',
      price: f.price.amount,
      priceCurrency: 'EUR',
      category: f.price.note,
      availability: 'https://schema.org/InStock',
    };
  }
  return ld;
};

/** Fil d'Ariane — améliore l'affichage du chemin dans les résultats de recherche. */
export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.label,
    item: canonicalUrl(it.path),
  })),
});

export const addressText = formatAddress;
