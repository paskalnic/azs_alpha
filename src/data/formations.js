/**
 * Catalogue des formations.
 *
 * Le contenu vit dans `content/formations/*.json` (une fiche par fichier,
 * c'est l'unité d'édition du back-office) et dans `content/shared.json`
 * pour les blocs communs aux dix fiches.
 */
import { FORMATIONS, CATEGORIES, SHARED } from '../content';

export { FORMATIONS, CATEGORIES };

export const FUNDING = SHARED.funding;
export const ACCESS_STEPS = SHARED.accessSteps;
export const ACCESSIBILITY = SHARED.accessibility;
export const TRAINER = SHARED.trainer;
export const CERTIFICATIONS = SHARED.certifications;
export const ROBERT_CERTIFICATION = SHARED.certifications.robert;

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const getFormation = (path) => FORMATIONS.find((f) => f.path === path);
export const formationsOf = (categoryId) => FORMATIONS.filter((f) => f.category === categoryId);
export const certificationOf = (f) =>
  typeof f.certification === 'string' ? CERTIFICATIONS[f.certification] : f.certification;
