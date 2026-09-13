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
  ...(SITE.ogImage ? { image: SITE.origin + SITE.ogImage } : {}),
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: SITE.certification.name,
    description: SITE.certification.label,
  },
});

/**
 * Le site lui-même. Complète `EducationalOrganization` : Google s'appuie
 * dessus pour le nom affiché du site dans ses résultats.
 */
export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.origin}/#website`,
  url: SITE.origin,
  name: SITE.name,
  description: SITE.description,
  inLanguage: 'fr-FR',
  publisher: { '@id': `${SITE.origin}/#organization` },
});

/**
 * Les modalités affichées sur la fiche sont rédigées pour un lecteur
 * (« Distanciel avec formateur tuteur en ligne ») ; `courseMode` n'accepte
 * que le vocabulaire de Google : Onsite, Online, Blended.
 */
const courseModes = (modes) => [
  ...new Set((modes || []).map((m) => (/distanc|ligne|visio/i.test(m) ? 'Online' : 'Onsite'))),
];

/** Fiche formation. */
export const courseLd = (f) => {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: f.title,
    description: f.summary,
    url: canonicalUrl(f.path),
    inLanguage: 'fr',
    // La fiche formation ne porte pas le nœud Organization : on y redonne le
    // nom et l'URL, sans quoi `provider` ne pointerait sur rien de défini.
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${SITE.origin}/#organization`,
      name: SITE.name,
      url: SITE.origin,
    },
  };
  if (f.duration || f.modes) {
    ld.hasCourseInstance = {
      '@type': 'CourseInstance',
      courseMode: courseModes(f.modes),
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
      // `category` attend le type de tarification, pas la note commerciale :
      // celle-ci reste affichée sur la fiche, à sa place.
      category: 'Paid',
      url: canonicalUrl(f.path),
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
