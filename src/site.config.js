/**
 * Configuration globale du site : identité, coordonnées, réglages SEO.
 * Source de vérité unique, consommée par les pages, les métadonnées,
 * les données structurées JSON-LD et la génération du sitemap.
 */

export const SITE = {
  /* Domaine de production — sert aux URL canoniques, à l'Open Graph et au sitemap. */
  origin: 'https://azsalphaformations.com',
  lang: 'fr',
  locale: 'fr_FR',

  name: 'AZS Alpha Formations',
  legalName: 'AZ Services Alpha Formations',
  tagline: 'Centre de formation · Guadeloupe',
  description:
    "Organisme de formation certifié Qualiopi à Baie-Mahault : anglais, français et techniques d'accueil, finançables OPCO et France Travail.",

  founder: {
    name: 'Axelle Zigault Urie',
    role: 'Formatrice & fondatrice',
    /* Qualifications relevées sur les fiches formation du site actuel. */
    credentials: "Formatrice d'anglais depuis 2002, certifiée CELTA Cambridge",
  },

  contact: {
    email: 'azs.alphaformations@gmail.com',
    phone: '0690 75 72 26',
    phoneE164: '+590690757226',
    phoneHref: 'tel:+590690757226',
    quoteHref: 'mailto:azs.alphaformations@gmail.com?subject=Demande%20de%20devis',
    hours: 'Lun–jeu 8h–16h30 · Ven 8h–13h',
  },

  /* Adresse unique — siège et lieu de formation.
     La cohérence de cette adresse (« NAP ») pèse sur le référencement local :
     elle doit être identique ici, sur Google Business Profile et sur les annuaires. */
  address: {
    street: '11 Rue des Jardins de Dalciat',
    postalCode: '97122',
    city: 'Baie-Mahault',
    region: 'Guadeloupe',
    country: 'FR',
  },

  certification: {
    name: 'Qualiopi',
    scope: 'Actions de formation',
    label:
      'Certification qualité délivrée au titre de la catégorie : actions de formation.',
  },

  /* Image de partage par défaut (Open Graph).
     Emplacement volontairement vide : à renseigner depuis le back-office. */
  ogImage: null,
};

export const formatAddress = (a) => `${a.street}, ${a.postalCode} ${a.city}`;

export default SITE;
