import { SITE } from '../site.config';

/** Construit l'URL canonique absolue d'un chemin. */
export const canonicalUrl = (path) =>
  SITE.origin + (path === '/' ? '/' : path.endsWith('/') ? path : `${path}/`);

/**
 * Normalise les métadonnées d'une page en un objet complet,
 * utilisé aussi bien au pré-rendu (injection dans le <head>)
 * qu'à la navigation côté client.
 */
export function buildHead({ title, description, path, image, noindex, jsonLd }) {
  const url = canonicalUrl(path);
  return {
    title: title === SITE.name ? title : `${title} — ${SITE.name}`,
    description,
    canonical: url,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    og: {
      'og:type': 'website',
      'og:site_name': SITE.name,
      'og:locale': SITE.locale,
      'og:title': title,
      'og:description': description,
      'og:url': url,
      ...(image || SITE.ogImage ? { 'og:image': SITE.origin + (image || SITE.ogImage) } : {}),
    },
    twitter: {
      'twitter:card': image || SITE.ogImage ? 'summary_large_image' : 'summary',
      'twitter:title': title,
      'twitter:description': description,
      ...(image || SITE.ogImage ? { 'twitter:image': SITE.origin + (image || SITE.ogImage) } : {}),
    },
    jsonLd: jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [],
  };
}

const escapeAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Sérialise le <head> pour le pré-rendu statique. */
export function renderHeadTags(head) {
  const meta = [
    `<title>${escapeAttr(head.title)}</title>`,
    `<meta name="description" content="${escapeAttr(head.description)}">`,
    `<meta name="robots" content="${head.robots}">`,
    `<link rel="canonical" href="${escapeAttr(head.canonical)}">`,
  ];
  for (const [k, v] of Object.entries({ ...head.og, ...head.twitter })) {
    const attr = k.startsWith('og:') ? 'property' : 'name';
    meta.push(`<meta ${attr}="${k}" content="${escapeAttr(v)}">`);
  }
  for (const block of head.jsonLd) {
    // </script> échappé pour ne pas fermer la balise depuis les données
    const json = JSON.stringify(block).replace(/</g, '\\u003c');
    meta.push(`<script type="application/ld+json">${json}</script>`);
  }
  return meta.join('\n    ');
}

/** Applique les métadonnées au document lors d'une navigation client. */
export function applyHead(head) {
  document.title = head.title;

  const set = (selector, create, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = create();
      document.head.appendChild(el);
    }
    if (el.tagName === 'LINK') el.setAttribute('href', value);
    else el.setAttribute('content', value);
  };

  set('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' }), head.description);
  set('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }), head.robots);
  set('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), head.canonical);

  for (const [k, v] of Object.entries(head.og)) {
    set(`meta[property="${k}"]`, () => {
      const m = document.createElement('meta');
      m.setAttribute('property', k);
      return m;
    }, v);
  }
  for (const [k, v] of Object.entries(head.twitter)) {
    set(`meta[name="${k}"]`, () => Object.assign(document.createElement('meta'), { name: k }), v);
  }

  // JSON-LD : on remplace les blocs gérés par l'application
  document.head.querySelectorAll('script[data-head-jsonld]').forEach((s) => s.remove());
  for (const block of head.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.headJsonld = '';
    s.textContent = JSON.stringify(block);
    document.head.appendChild(s);
  }
}
