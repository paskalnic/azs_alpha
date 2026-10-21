import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'Guide-livraison-AZ-Services-Alpha-Formations.pdf');

const W = 595.28;
const H = 841.89;
const M = 52;
const BLUE = '0.071 0.243 0.361';
const CYAN = '0.118 0.533 0.769';
const PALE = '0.925 0.969 0.988';
const INK = '0.071 0.188 0.243';
const MUTED = '0.333 0.455 0.522';

const pages = [];
let commands = [];
let y = H - M;

const esc = (value) => String(value)
  .replaceAll('\\', '\\\\')
  .replaceAll('(', '\\(')
  .replaceAll(')', '\\)');

function text(value, x, baseline, size = 10.5, font = 'F1', color = INK) {
  commands.push(`BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x.toFixed(2)} ${baseline.toFixed(2)} Tm (${esc(value)}) Tj ET`);
}

function line(x1, y1, x2, y2, color = '0.82 0.89 0.92', width = 0.7) {
  commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
}

function fillRect(x, bottom, width, height, color) {
  commands.push(`${color} rg ${x} ${bottom} ${width} ${height} re f`);
}

function wrap(value, width, size = 10.5) {
  const max = Math.max(18, Math.floor(width / (size * 0.52)));
  const words = String(value).split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) current = word;
    else if (`${current} ${word}`.length <= max) current += ` ${word}`;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function paragraph(value, options = {}) {
  const {
    x = M,
    width = W - 2 * M,
    size = 10.5,
    font = 'F1',
    color = INK,
    leading = size * 1.38,
    after = 8,
  } = options;
  for (const row of wrap(value, width, size)) {
    text(row, x, y, size, font, color);
    y -= leading;
  }
  y -= after;
}

function bullet(value, options = {}) {
  const { x = M + 4, width = W - 2 * M - 8, size = 10.2, after = 4 } = options;
  const rows = wrap(value, width - 18, size);
  text('•', x, y, size + 1, 'F2', CYAN);
  rows.forEach((row, index) => {
    text(row, x + 17, y, size, 'F1', INK);
    if (index < rows.length - 1) y -= size * 1.35;
  });
  y -= size * 1.35 + after;
}

function heading(value) {
  y -= 3;
  text(value, M, y, 16, 'F2', BLUE);
  y -= 10;
  line(M, y, W - M, y, CYAN, 1.2);
  y -= 24;
}

function subheading(value) {
  text(value, M, y, 11.5, 'F2', BLUE);
  y -= 19;
}

function callout(title, body) {
  const rows = wrap(body, W - 2 * M - 34, 9.8);
  const height = 42 + rows.length * 13;
  fillRect(M, y - height + 14, W - 2 * M, height, PALE);
  text(title, M + 15, y - 7, 10.5, 'F2', BLUE);
  let by = y - 25;
  for (const row of rows) {
    text(row, M + 15, by, 9.8, 'F1', INK);
    by -= 13;
  }
  y -= height + 4;
}

function codeLine(value) {
  fillRect(M, y - 7, W - 2 * M, 21, '0.965 0.975 0.98');
  text(value, M + 10, y, 8.7, 'F3', INK);
  y -= 25;
}

function startPage(title) {
  commands = [];
  y = H - M;
  fillRect(0, H - 9, W, 9, CYAN);
  text('AZ SERVICES ALPHA FORMATIONS', M, y, 8.5, 'F2', CYAN);
  text('Guide de livraison', W - M - 90, y, 8.5, 'F1', MUTED);
  y -= 27;
  heading(title);
}

function endPage(number) {
  // La mise en page est manuelle : rien ne renvoie le texte à la page
  // suivante. Sans cette garde, un paragraphe allongé passait sous le filet
  // de pied de page — ou hors de la feuille — sans que rien ne le signale.
  if (y < 56) {
    throw new Error(`Page ${number} : le contenu déborde de ${Math.ceil(56 - y)} points sur le pied de page. Raccourcir ou répartir.`);
  }
  line(M, 43, W - M, 43);
  text('Version 1.1 — mise à jour le 21 octobre 2026', M, 27, 8, 'F1', MUTED);
  text(String(number), W - M - 5, 27, 8, 'F2', MUTED);
  pages.push(commands.join('\n'));
}

// Page 1 — couverture
commands = [];
fillRect(0, 0, W, H, '0.957 0.984 0.996');
fillRect(0, H - 16, W, 16, CYAN);
fillRect(M, H - 176, 54, 54, CYAN);
// Monogramme dans une pastille de 54 pt : les initiales seules y tiennent,
// le nom complet vit dans l'en-tête courant de chaque page.
text('AZ', M + 16, H - 157, 17, 'F2', '1 1 1');
text('GUIDE DE LIVRAISON', M, H - 230, 11, 'F2', CYAN);
text('Site internet et', M, H - 276, 29, 'F2', BLUE);
text('back-office sans CMS', M, H - 314, 29, 'F2', BLUE);
text('Procédure de remise à la cliente, raccordement du domaine,', M, H - 354, 11, 'F1', MUTED);
text('gestion des accès et contrôle avant mise en ligne définitive.', M, H - 371, 11, 'F1', MUTED);
fillRect(M, H - 525, W - 2 * M, 102, '1 1 1');
text('ENVIRONNEMENT ACTUEL', M + 18, H - 449, 9, 'F2', CYAN);
text('Site : https://jocular-licorice-ef0a42.netlify.app/', M + 18, H - 473, 10, 'F3', INK);
text('Admin : https://jocular-licorice-ef0a42.netlify.app/admin/', M + 18, H - 493, 10, 'F3', INK);
text('Dépôt : github.com/paskalnic/azs_alpha — branche main', M + 18, H - 513, 10, 'F3', INK);
text('État : site public, administration GitHub opérationnelle', M, 105, 10, 'F2', BLUE);
text('Version 1.1 — 21 octobre 2026', M, 81, 9, 'F1', MUTED);
pages.push(commands.join('\n'));

// Page 2
startPage('1. État du projet avant livraison');
subheading('Éléments déjà validés');
[
  'Le site est publié depuis la branche main et Netlify redéploie automatiquement après chaque commit.',
  'Les 25 pages du sitemap répondent correctement et les 30 liens ou ressources internes contrôlés sont accessibles.',
  'La connexion GitHub OAuth fonctionne et le compte paskalnic est autorisé.',
  'Une modification de texte, sa publication, puis son retrait ont été testés de bout en bout.',
  'Le dépôt et l’affichage d’une image JPEG ont été validés sur le site public.',
].forEach((item) => bullet(item));

subheading('À terminer avant la remise définitive');
[
  'Retirer la photographie de test représentant une gendarme si elle ne constitue pas le portrait définitif de la formatrice.',
  'Remplacer les mentions « SIRET à compléter » et « NDA à compléter » par les informations officielles.',
  'Renseigner un texte alternatif pertinent pour chaque image porteuse d’information.',
  'Rattacher le nom de domaine définitif et vérifier le certificat HTTPS.',
  'Mettre à jour le domaine canonique du site si le domaine fourni diffère de azsalphaformations.com.',
  'Tester la connexion au back-office avec le propre compte GitHub de la cliente.',
].forEach((item) => bullet(item));

callout('Règle de sécurité', 'Aucun mot de passe, secret GitHub ou jeton d’accès ne doit être envoyé par e-mail, messagerie ou ajouté au dépôt. Chaque personne utilise son propre compte.');
endPage(2);

// Page 3
startPage('2. Informations à demander à la cliente');
subheading('Informations administratives et éditoriales');
[
  'Raison sociale et nom commercial exacts.',
  'SIRET, numéro de déclaration d’activité, adresse officielle et identité du représentant légal.',
  'Téléphone, adresse e-mail, horaires et coordonnées définitives.',
  'Données Qualiopi, résultats annuels et date de dernière mise à jour.',
  'Logo, photographies et vidéos avec confirmation des droits d’utilisation et de diffusion.',
  'Nom de domaine souhaité et nom du prestataire auprès duquel il est enregistré.',
  'Information sur les adresses e-mail déjà rattachées au domaine afin de préserver les enregistrements MX.',
].forEach((item) => bullet(item));

subheading('Comptes à créer');
paragraph('GitHub — obligatoire pour utiliser le back-office', { font: 'F2', after: 5 });
paragraph('La cliente crée gratuitement son propre compte GitHub et transmet uniquement son identifiant public. Elle ne transmet jamais son mot de passe.', { color: MUTED });
paragraph('Netlify — recommandé pour la propriété du projet', { font: 'F2', after: 5 });
paragraph('La cliente peut créer un compte Netlify avec son adresse professionnelle ; le projet y sera alors transféré. À court terme, il peut rester sur le compte du prestataire, à condition que ce choix soit prévu contractuellement. Elle n’a pas besoin d’accès Netlify pour modifier son site : le back-office passe par GitHub.', { color: MUTED });
paragraph('Compte chez le registrar — doit rester à la cliente', { font: 'F2', after: 5 });
paragraph('La cliente conserve la propriété du domaine. Chez SiteGround, elle ajoute le prestataire comme collaborateur du site : il accède au DNS Zone Editor, sans voir ses e-mails ni sa facturation. Elle ne transmet jamais son mot de passe.', { color: MUTED });
endPage(3);

// Page 4
startPage('3. Accès GitHub et Netlify');
subheading('Autoriser la cliente dans GitHub');
[
  'Ouvrir le dépôt paskalnic/azs_alpha.',
  'Aller dans Settings, puis Collaborators ou Manage access.',
  'Inviter l’identifiant GitHub de la cliente avec un droit d’écriture.',
  'Demander à la cliente d’accepter l’invitation reçue par e-mail.',
].forEach((item) => bullet(item));

subheading('Autoriser son compte dans le back-office');
paragraph('Dans Netlify, ouvrir Project configuration → Environment variables, puis modifier la variable suivante :', { color: MUTED });
codeLine('GITHUB_ALLOWED_USERS=paskalnic,identifiant-de-la-cliente');
paragraph('Relancer ensuite un déploiement depuis Deploys → Trigger deploy. Ne jamais ajouter le mot de passe GitHub de la cliente.', { color: MUTED });

subheading('Propriété Netlify');
paragraph('Pour une livraison complète, le projet est transféré dans l’équipe Netlify de la cliente : Project configuration → General → Project information → Transfer project. Les plans Free et Personal n’acceptent pas de second membre : le prestataire assure ensuite la maintenance en poussant sur le dépôt, sans accès à l’équipe.', { color: MUTED });
paragraph('Le dépôt est public. Sur un plan gratuit, c’est ce qui permet aux enregistrements faits avec le compte GitHub de la cliente de se publier sans approbation. Il ne contient aucun secret.', { color: MUTED });

callout('À ne pas transmettre', 'Ne jamais communiquer GITHUB_CLIENT_SECRET, un jeton OAuth, une clé SSH, le mot de passe Netlify ou le mot de passe GitHub. La cliente n’a besoin que de ses propres comptes et de l’adresse /admin/.');
endPage(4);

// Page 5
startPage('4. Raccorder le nom de domaine');
subheading('Ajouter le domaine dans Netlify');
[
  'Ouvrir Domain management dans le projet Netlify.',
  'Choisir Add a domain → Add a domain you already own.',
  'Saisir le domaine fourni par la cliente.',
  'Choisir Netlify DNS ou conserver le fournisseur DNS actuel.',
  'Appliquer chez le registrar les enregistrements exacts indiqués par Netlify.',
  'Conserver tous les enregistrements MX, SPF, DKIM et DMARC utiles aux e-mails professionnels.',
  'Attendre la propagation DNS et vérifier que Netlify a délivré le certificat HTTPS.',
].forEach((item) => bullet(item));

subheading('Mettre à jour GitHub OAuth');
paragraph('Le jour du raccordement, dans l’application OAuth GitHub, remplacer l’URL de rappel par celle du domaine :', { color: MUTED });
codeLine('https://son-domaine.fr/.netlify/functions/callback');
paragraph('Une application OAuth n’accepte qu’une URL de rappel : le back-office ne fonctionne plus depuis l’adresse .netlify.app après ce changement. Mettre aussi à jour la Homepage URL. Ne pas activer la correspondance générique des URL, Device Flow ou l’expiration des jetons pour cette version.', { color: MUTED });

subheading('Référencement');
paragraph('Si le domaine final n’est pas azsalphaformations.com, mettre à jour l’URL du site dans src/site.config.js, reconstruire et vérifier les URL canoniques ainsi que sitemap.xml.', { color: MUTED });
endPage(5);

// Page 6
startPage('5. Ce qui est remis à la cliente');
subheading('Adresses à communiquer');
codeLine('Site public : https://son-domaine.fr/');
codeLine('Administration : https://son-domaine.fr/admin/');

subheading('Mode d’emploi court');
[
  'Ouvrir l’adresse /admin/ et sélectionner « Se connecter avec GitHub ».',
  'Choisir une rubrique : formations, coordonnées, accueil, contact, qualité, résultats ou pages légales.',
  'Modifier les champs souhaités puis cliquer sur « Enregistrer ».',
  'Attendre généralement une à deux minutes avant de contrôler le site public.',
  'Pour un média : JPG, PNG, WebP, GIF, MP4 ou WebM, avec une taille maximale de 4 Mo.',
  'Compléter le texte alternatif des images informatives.',
  'Ne pas fermer la page avec des changements non enregistrés.',
].forEach((item) => bullet(item));

subheading('Assistance à convenir contractuellement');
[
  'Responsable du renouvellement du domaine et des éventuels frais Netlify.',
  'Responsable des sauvegardes et de la maintenance technique.',
  'Délai d’intervention en cas de panne ou de contenu erroné.',
  'Procédure de restitution ou de transfert en fin de prestation.',
].forEach((item) => bullet(item));
endPage(6);

// Page 7
startPage('6. Checklist de livraison finale');
const checks = [
  'Photo de test retirée ou remplacée par le média définitif.',
  'Textes alternatifs complétés.',
  'SIRET, NDA, adresse et coordonnées vérifiés.',
  'Pages légales relues et validées par la cliente.',
  'Nom de domaine connecté et HTTPS actif.',
  'E-mails du domaine toujours opérationnels.',
  'URL canonique et sitemap alignés sur le domaine final.',
  'Compte GitHub de la cliente ajouté au dépôt.',
  'GITHUB_ALLOWED_USERS mis à jour sans exposer de secret.',
  'Connexion de la cliente à /admin/ testée.',
  'Modification puis restauration d’un contenu testées avec son compte.',
  'Propriété Netlify décidée et documentée.',
  'URL du site et URL d’administration remises à la cliente.',
  'Modalités de maintenance et de restitution confirmées.',
];
for (const item of checks) {
  text('□', M + 3, y, 12, 'F1', CYAN);
  const rows = wrap(item, W - 2 * M - 28, 10.3);
  rows.forEach((row, index) => {
    text(row, M + 25, y, 10.3, 'F1', INK);
    if (index < rows.length - 1) y -= 13.5;
  });
  y -= 22;
}
callout('Livraison terminée', 'La livraison peut être considérée comme achevée lorsque toutes les cases ci-dessus sont validées et que la cliente a réalisé elle-même une connexion et une modification depuis son compte GitHub.');
endPage(7);

function encodeWinAnsi(value) {
  const special = new Map([
    [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
    [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
    [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
    [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
    [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
    [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
    [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f], [0x25a1, 0x6f],
    // « → » n'existe pas dans WinAnsi, et tout caractère absent de cette
    // table sort en « ? ». La version 1.0 imprimait ainsi « Deploys ? Trigger
    // deploy ». « › » est le plus proche disponible, et c'est déjà le signe
    // des fils d'Ariane d'interface : « Deploys › Trigger deploy ».
    [0x2192, 0x9b],
  ]);
  const bytes = [];
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code <= 0xff) bytes.push(code);
    else bytes.push(special.get(code) ?? 0x3f);
  }
  return Buffer.from(bytes);
}

const objects = [];
const add = (body) => {
  objects.push(Buffer.isBuffer(body) ? body : Buffer.from(body, 'binary'));
  return objects.length;
};

const catalog = add('');
const pagesRoot = add('');
const regular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const mono = add('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>');
const pageIds = [];

for (const content of pages) {
  const stream = encodeWinAnsi(content);
  const streamId = add(Buffer.concat([
    Buffer.from(`<< /Length ${stream.length} >>\nstream\n`, 'binary'),
    stream,
    Buffer.from('\nendstream', 'binary'),
  ]));
  const pageId = add(`<< /Type /Page /Parent ${pagesRoot} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R /F3 ${mono} 0 R >> >> /Contents ${streamId} 0 R >>`);
  pageIds.push(pageId);
}

objects[catalog - 1] = Buffer.from(`<< /Type /Catalog /Pages ${pagesRoot} 0 R >>`, 'binary');
objects[pagesRoot - 1] = Buffer.from(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`, 'binary');

const chunks = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary')];
const offsets = [0];
let offset = chunks[0].length;
objects.forEach((body, index) => {
  offsets.push(offset);
  const chunk = Buffer.concat([
    Buffer.from(`${index + 1} 0 obj\n`, 'binary'),
    body,
    Buffer.from('\nendobj\n', 'binary'),
  ]);
  chunks.push(chunk);
  offset += chunk.length;
});

const xref = offset;
let trailer = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let index = 1; index < offsets.length; index += 1) {
  trailer += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
}
trailer += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
chunks.push(Buffer.from(trailer, 'binary'));

fs.writeFileSync(output, Buffer.concat(chunks));
console.log(`PDF généré : ${output} (${pages.length} pages)`);
