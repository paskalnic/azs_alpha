/**
 * Chargement du contenu.
 *
 * Tout le contenu éditable vit dans `content/` à la racine, hors du code :
 * c'est ce que le back-office lit et réécrit. Ce module l'assemble et lui
 * redonne les valeurs dérivées des réglages.
 *
 * Les fichiers sont importés à la compilation : le contenu part donc dans le
 * HTML pré-rendu, sans appel réseau à l'exécution.
 */
import settings from '../../content/settings.json';
import shared from '../../content/shared.json';
import categories from '../../content/categories.json';
import home from '../../content/pages/home.json';
import quality from '../../content/pages/quality.json';
import results from '../../content/pages/results.json';
import contact from '../../content/pages/contact.json';
import { parseLegalDocument } from './markdown';

/* ── Réglages, et ce qui s'en déduit ─────────────────────── */

const address = settings.address;

export const SITE = {
  ...settings,
  lang: 'fr',
  locale: 'fr_FR',
  contact: {
    ...settings.contact,
    phoneHref: `tel:${settings.contact.phoneE164}`,
    quoteHref: `mailto:${settings.contact.email}?subject=Demande%20de%20devis`,
  },
  /* Emplacement d'image de partage : vide tant qu'aucune n'est déposée. */
  ogImage: settings.ogImage ?? null,
};

export const formatAddress = (a) => `${a.street}, ${a.postalCode} ${a.city}`;

/* ── Marqueurs ────────────────────────────────────────────
   Certains textes citent les réglages. Plutôt que de figer la valeur au
   moment de la migration, ils portent un marqueur : le texte reste
   modifiable dans le back-office et la donnée reste unique. */

const VALUES = {
  name: SITE.name,
  city: address.city,
  address: formatAddress(address),
  phone: SITE.contact.phone,
  email: SITE.contact.email,
  hours: SITE.contact.hours,
  founder: SITE.founder.name,
  credentials: SITE.founder.credentials,
  certificationLabel: SITE.certification.label,
};

const PLACEHOLDER = /\{\{(\w+)\}\}/g;

/** Remplace les marqueurs dans toutes les chaînes d'une structure. */
export function resolve(node) {
  if (typeof node === 'string') {
    return node.replace(PLACEHOLDER, (whole, key) => (key in VALUES ? VALUES[key] : whole));
  }
  if (Array.isArray(node)) return node.map(resolve);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = resolve(v);
    return out;
  }
  return node;
}

/* ── Contenu ─────────────────────────────────────────────── */

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);

const formationModules = import.meta.glob('../../content/formations/*.json', {
  eager: true,
  import: 'default',
});
// Une fiche en brouillon (créée depuis le back-office et pas encore relue)
// n'existe pas pour le site : ni page, ni carte au catalogue, ni sitemap.
export const FORMATIONS = resolve(
  Object.values(formationModules).filter((f) => !f.draft).sort(byOrder),
);

const legalModules = import.meta.glob('../../content/legal/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});
export const LEGAL_PAGES = Object.entries(legalModules)
  .map(([file, raw]) => ({
    slug: file.split('/').pop().replace(/\.md$/, ''),
    ...parseLegalDocument(raw),
  }))
  .sort(byOrder)
  .map(resolve);

export const CATEGORIES = resolve(categories);
export const SHARED = resolve(shared);
export const landingData = resolve(home);
export const QUALITY = resolve(quality);
export const RESULTS = resolve(results);
export const CONTACT_PAGE = resolve(contact);
