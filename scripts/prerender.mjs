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

const written = [];
for (const routePath of prerenderPaths()) {
  const { html, head } = render(routePath);
  if (!head) throw new Error(`${routePath} : aucune métadonnée — la page appelle-t-elle useHead() ?`);

  const page = template
    .replace('<!--app-head-->', renderHeadTags(head))
    .replace('<!--app-html-->', html)
    .replace('<div id="root">', '<div id="root" data-prerendered="true">');

  const file = path.join(dist, outFile(routePath));
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, page);
  written.push([routePath, path.relative(dist, file), Buffer.byteLength(page)]);
}

// — sitemap.xml —
const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.sitemap && r.path !== '*')
  .map((r) => {
    const loc = SITE.origin + (r.path === '/' ? '/' : `${r.path.replace(/\/$/, '')}/`);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.sitemap.changefreq}</changefreq>
    <priority>${r.sitemap.priority.toFixed(1)}</priority>
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
