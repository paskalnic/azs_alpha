/**
 * Pages légales — `content/legal/*.md`.
 *
 * Le Markdown est le format d'édition ; il est reconverti en blocs de rendu
 * au chargement (voir src/content/markdown.js).
 */
import { LEGAL_PAGES } from '../content';

export { LEGAL_PAGES };
export const getLegalPage = (slug) => LEGAL_PAGES.find((p) => p.slug === slug);
