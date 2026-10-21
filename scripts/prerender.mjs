/**
 * Pré-rendu statique.
 *
 * Après les deux builds Vite (client puis serveur), rend chaque route en HTML
 * complet et l'écrit à son emplacement d'URL : /contact/ devient
 * dist/contact/index.html. Le HTML livré contient donc le texte et les
 * métadonnées dans la source — ce que les moteurs de recherche et les robots
 * de prévisualisation des réseaux sociaux lisent sans exécuter de JavaScript.
 *
 * Génère aussi sitemap.xml et robots.txt à partir de la table de routage.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const dist = path.join(root, 'dist');

const { render, prerenderPaths, routes, renderHeadTags, SITE } = await import(
  path.join(dist, 'server/entry-server.js')
);

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf-8');
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html : marqueurs <!--app-html--> ou <!--app-head--> absents');
}

const outFile = (p) => (p === '/' ? 'index.html' : path.join(p.replace(/^\/|\/$/g, ''), 'index.html'));

/**
 * L'image marquée `fetchpriority="high"` est le LCP de la page. Elle est
 * déclarée dans le HTML, donc l'analyseur de préchargement la trouve — mais
 * seulement après avoir lu le corps du document. Un `preload` en tête la fait
 * partir en même temps que la feuille de style.
 */
function preloadLcpImage(html) {
  const img = html.match(/<img\b[^>]*\bfetchpriority="high"[^>]*>/i);
  const src = img && img[0].match(/\bsrc="([^"]+)"/i);
  return src ? `<link rel="preload" as="image" href="${src[1]}" fetchpriority="high">\n    ` : '';
}

/** Assemble une page complète à partir du gabarit et du rendu serveur. */
const compose = (html, head) =>
  template
    .replace('<!--app-head-->', preloadLcpImage(html) + renderHeadTags(head))
    .replace('<!--app-html-->', html)
    .replace('<div id="root">', '<div id="root" data-prerendered="true">');

const written = [];
for (const routePath of prerenderPaths()) {
  const { html, head } = render(routePath);
  if (!head) throw new Error(`${routePath} : aucune métadonnée — la page appelle-t-elle useHead() ?`);

  const page = compose(html, head);

  const file = path.join(dist, outFile(routePath));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page);
  written.push([routePath, path.relative(dist, file), Buffer.byteLength(page)]);
}

// — page 404 —
// Cloudflare Pages sert /404.html, avec un vrai statut 404, sur toute URL
// inconnue. Ce fichier n'est pas un simple confort : **sans lui, Pages
// considère le site comme une application d'une seule page** et répond à
// n'importe quelle adresse par l'accueil, en 200. Google verrait alors une
// infinité de doublons de la page d'accueil — des « soft 404 » à perte de vue.
// Ne jamais le supprimer.
{
  const { html, head } = render('/404/');
  const page = compose(html, head);
  await fs.writeFile(path.join(dist, '404.html'), page);
  written.push(['(404)', '404.html', Buffer.byteLength(page)]);
}

// — sitemap.xml —
//
// Une adresse par page, et rien d'autre.
//
// La version précédente écrivait la date du build dans <lastmod> pour toutes
// les pages. Or chaque « Enregistrer » du back-office relance un build : une
// virgule corrigée sur le TOEIC annonçait les 25 pages modifiées le jour même.
// Google n'utilise <lastmod> que s'il est « systématiquement et vérifiablement
// exact » ; une date qui ment sur 24 pages sur 25 lui apprend à l'ignorer.
// Le champ est facultatif : mieux vaut ne rien dire que dire faux.
//
// <changefreq> et <priority> sont retirés pour une autre raison : ils étaient
// exacts, mais Google les ignore entièrement.
const urls = routes
  .filter((r) => r.sitemap && r.path !== '*')
  .map((r) => {
    const loc = SITE.origin + (r.path === '/' ? '/' : `${r.path.replace(/\/$/, '')}/`);
    return `  <url>
    <loc>${loc}</loc>
  </url>`;
  })
  .join('\n');

await fs.writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

await fs.writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`,
);

// le bundle serveur n'a pas à être déployé
await fs.rm(path.join(dist, 'server'), { recursive: true, force: true });

console.log('\nPages pré-rendues :');
for (const [route, file, size] of written) {
  console.log(`  ${route.padEnd(34)} ${file.padEnd(38)} ${(size / 1024).toFixed(1)} kB`);
}
console.log(`  sitemap.xml (${routes.filter((r) => r.sitemap && r.path !== '*').length} URL) + robots.txt`);
