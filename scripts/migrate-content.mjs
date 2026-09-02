/**
 * Migration ponctuelle : extrait le contenu des modules JavaScript vers des
 * fichiers de données que le back-office pourra lire et réécrire.
 *
 * Les modules sont assemblés puis exécutés, et ce qu'ils exportent est
 * sérialisé — les valeurs sont donc reprises telles que l'application les
 * voit, sans recopie manuelle.
 *
 * À usage unique : une fois `content/` en place, ce script n'a plus lieu
 * d'être lancé (il écraserait les modifications faites depuis le back-office).
 */
import { build } from 'esbuild';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const tmp = path.join(root, 'node_modules/.migrate');
const content = path.join(root, 'content');
mkdirSync(tmp, { recursive: true });

const load = async (name, entry) => {
  await build({
    entryPoints: [path.join(root, entry)],
    bundle: true, format: 'esm', platform: 'node',
    outfile: path.join(tmp, `${name}.mjs`), logLevel: 'error',
  });
  return import(path.join(tmp, `${name}.mjs`));
};

const write = (rel, data) => {
  const file = path.join(content, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return rel;
};

const formations = await load('formations', 'src/data/formations.js');
const landing = await load('landing', 'src/data/landingData.js');
const pages = await load('pages', 'src/data/pagesData.js');
const legal = await load('legal', 'src/data/legalPages.js');
const config = await load('config', 'src/site.config.js');

const written = [];

/* — Réglages : identité et coordonnées, la source des valeurs interpolées — */
const { SITE } = config;
written.push(write('settings.json', {
  name: SITE.name,
  legalName: SITE.legalName,
  tagline: SITE.tagline,
  description: SITE.description,
  origin: SITE.origin,
  founder: SITE.founder,
  contact: SITE.contact,
  address: SITE.address,
  certification: SITE.certification,
}));

/* — Blocs partagés : écrits une fois, utilisés par les dix fiches.
     Les valeurs interpolées deviennent des marqueurs, pour rester
     modifiables sans figer la configuration. — */
const unInterpolate = (s) => s
  .replace(SITE.founder.name, '{{founder}}')
  .replace(SITE.contact.phone, '{{phone}}')
  .replace(SITE.founder.credentials, '{{credentials}}');

written.push(write('shared.json', {
  funding: formations.FUNDING,
  accessSteps: formations.ACCESS_STEPS,
  accessibility: {
    ...formations.ACCESSIBILITY,
    referent: unInterpolate(formations.ACCESSIBILITY.referent),
  },
  trainer: {
    ...formations.TRAINER,
    text: unInterpolate(formations.TRAINER.text),
  },
  certifications: { robert: formations.ROBERT_CERTIFICATION },
}));

written.push(write('categories.json', formations.CATEGORIES));

/* — Une fiche, un fichier : c'est l'unité d'édition du back-office — */
for (const f of formations.FORMATIONS) {
  written.push(write(`formations/${f.id}.json`, f));
}

written.push(write('pages/home.json', landing.landingData));
written.push(write('pages/quality.json', pages.QUALITY));
written.push(write('pages/results.json', pages.RESULTS));
written.push(write('pages/contact.json', pages.CONTACT_PAGE));

/* — Pages légales : les blocs {tag, text} redeviennent du Markdown, seul
     format éditable confortablement dans un formulaire. — */
const toMarkdown = (blocks) => blocks.map((b) => {
  if (b.tag === 'h2') return `## ${b.text}`;
  if (b.tag === 'h3' || b.tag === 'h4') return `### ${b.text}`;
  if (b.tag === 'li') return `- ${b.text}`;
  return b.text;
}).join('\n\n') + '\n';

for (const page of legal.LEGAL_PAGES) {
  const front = [
    '---',
    `title: ${JSON.stringify(page.title)}`,
    page.seoTitle ? `seoTitle: ${JSON.stringify(page.seoTitle)}` : null,
    `path: ${JSON.stringify(page.path)}`,
    `summary: ${JSON.stringify(page.summary)}`,
    '---',
    '',
  ].filter(Boolean).join('\n');
  const file = path.join(content, 'legal', `${page.slug}.md`);
  writeFileSync(file, front + toMarkdown(page.blocks));
  written.push(`legal/${page.slug}.md`);
}

rmSync(tmp, { recursive: true, force: true });
console.log(`${written.length} fichiers de contenu produits :\n`);
for (const w of written) console.log('  content/' + w);
