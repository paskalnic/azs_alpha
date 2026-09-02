/**
 * Lecture et écriture des fichiers de contenu.
 *
 * Deux formats : JSON pour les données structurées, Markdown à en-tête pour
 * les pages légales. La sérialisation doit produire exactement la mise en
 * forme attendue par le dépôt, sans quoi chaque enregistrement créerait un
 * écart de formatage dans l'historique.
 */

// Accepte les fichiers historiques sans saut de ligne après le délimiteur et
// le format canonique avec une ligne blanche. Les deux sauts sont consommés
// afin que le corps ne gagne pas une ligne vide à chaque enregistrement.
const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n)?(?:\r?\n)?/;

export function parse(text, format) {
  if (format === 'markdown') {
    const match = FRONT_MATTER.exec(text);
    if (!match) return { body: text };
    const data = {};
    for (const line of match[1].split('\n')) {
      const sep = line.indexOf(':');
      if (sep === -1) continue;
      const key = line.slice(0, sep).trim();
      const raw = line.slice(sep + 1).trim();
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
    return { ...data, body: text.slice(match[0].length) };
  }
  return JSON.parse(text);
}

export function serialize(value, format) {
  if (format === 'markdown') {
    const { body = '', ...meta } = value;
    const header = Object.entries(meta)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : JSON.stringify(v)}`)
      .join('\n');
    return `---\n${header}\n---\n\n${body.trimEnd()}\n`;
  }
  return JSON.stringify(value, null, 2) + '\n';
}

/**
 * Réinjecte les champs édités dans l'objet d'origine.
 *
 * Le formulaire ne connaît que les champs déclarés au schéma ; tout ce qu'il
 * ignore doit être préservé tel quel, sinon un enregistrement effacerait
 * silencieusement des données que l'application utilise.
 */
export function merge(original, edited) {
  if (Array.isArray(edited)) return edited;
  if (edited && typeof edited === 'object') {
    const out = { ...original };
    for (const [key, value] of Object.entries(edited)) {
      out[key] =
        value && typeof value === 'object' && !Array.isArray(value)
          ? merge(original?.[key] ?? {}, value)
          : value;
    }
    return out;
  }
  return edited;
}
