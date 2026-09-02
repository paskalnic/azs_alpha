/**
 * Analyse des pages légales écrites en Markdown.
 *
 * Le Markdown n'est qu'un format d'édition : il est reconverti vers les mêmes
 * blocs `{ tag, text }` que le composant rend déjà. Aucune bibliothèque n'est
 * embarquée, et rien n'est injecté en HTML brut — le texte reste du texte.
 *
 * Le jeu de syntaxe est volontairement réduit à ce que produit la migration :
 * titres `##` et `###`, listes `-`, paragraphes.
 */

/** Sépare l'en-tête de métadonnées du corps du document. */
export function parseFrontMatter(raw) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    try {
      meta[key] = JSON.parse(value);
    } catch {
      meta[key] = value;
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}

/** Transforme le corps Markdown en blocs de rendu. */
export function parseBlocks(body) {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith('### ')) return { tag: 'h3', text: chunk.slice(4).trim() };
      if (chunk.startsWith('## ')) return { tag: 'h2', text: chunk.slice(3).trim() };
      if (chunk.startsWith('- ')) return { tag: 'li', text: chunk.slice(2).trim() };
      return { tag: 'p', text: chunk };
    });
}

export function parseLegalDocument(raw) {
  const { meta, body } = parseFrontMatter(raw);
  return { ...meta, blocks: parseBlocks(body) };
}
