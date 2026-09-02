/**
 * Contenus des pages éditoriales (hors fiches formation).
 * Repris du site actuel, réécrits et harmonisés.
 */

import { SITE } from '../site.config';

export const QUALITY = {
  path: '/nos-engagements-qualite/',
  title: 'Nos engagements qualité',
  summary:
    "Les engagements qualité d'AZS Alpha Formations, organisme certifié Qualiopi : enseignement, accompagnement, délais de réponse et sécurité.",
  intro:
    "Toutes nos prestations sont personnalisées et ajustées pour répondre précisément à la demande. Notre démarche qualité s'organise autour de trois axes : la satisfaction du client, l'implication du personnel et l'amélioration continue.",
  pillars: [
    { title: 'La satisfaction du client', text: "Chaque parcours part d'un besoin réel, évalué avant le démarrage et suivi jusqu'à l'attestation." },
    { title: "L'implication du personnel", text: 'Une seule interlocutrice, disponible sur toute la durée de la formation.' },
    { title: 'L’amélioration continue', text: 'Les retours des stagiaires alimentent la révision des programmes et des méthodes.' },
  ],
  commitments: [
    {
      title: 'Offrir un enseignement de qualité',
      items: [
        "Méthodes d'enseignement ancrées dans une perspective actionnelle et communicative",
        'Qualité des programmes contrôlée tout au long de la formation',
        'Matériel adapté et rigoureusement entretenu',
      ],
    },
    {
      title: 'Accompagner les apprenants dans les meilleures conditions',
      items: [
        "Personnel disponible sur l'intégralité du temps de cours",
        'Plusieurs moyens de communication pour répondre à toutes les demandes',
        'Suivi individualisé du parcours de chaque apprenant',
        'Procédure de réclamation définie',
        "Procédures d'aide aux démarches administratives",
      ],
    },
    {
      title: 'Proposer des formations adaptées aux besoins et aux niveaux',
      items: [
        'Système d’évaluation défini : diagnostique, formative et sommative',
        'Suivi individualisé de la progression et remédiations',
        'Niveaux, contenus et offre de cours adaptés aux objectifs',
        'Respect du nombre d’heures de formation et des effectifs par type de formation',
        'Diffusion d’informations sur les certifications et diplômes',
      ],
    },
    {
      title: 'Développer les compétences interculturelles',
      items: [
        'Activités de découverte et d’échanges sur les différences culturelles',
        'Engagement dans des projets interculturels',
        'Sorties pédagogiques, conférences et ateliers thématiques',
      ],
    },
    {
      title: 'Communiquer rapidement toute information utile',
      items: [
        'Réponse aux demandes d’information sous 48 heures',
        'Tarifs et conditions de vente accessibles',
        'Suivi individualisé des inscriptions',
        'Procédures administratives d’accueil clairement définies',
      ],
    },
    {
      title: 'Respecter les normes de sécurité en vigueur',
      items: [
        'Mesures d’évacuation clairement établies et visibles',
        'Exercices incendie organisés à chaque rentrée',
        'Locaux et matériel rigoureusement entretenus',
      ],
    },
  ],
};

/**
 * Indicateurs de résultats.
 *
 * ⚠ Chiffres provisoires, repris de la page d'accueil. L'indicateur 2 du
 * référentiel Qualiopi impose des résultats à jour et accessibles au public :
 * ce bloc est le seul endroit à mettre à jour chaque année.
 */
export const RESULTS = {
  path: '/nos-resultats/',
  title: 'Nos résultats',
  summary:
    "Les indicateurs de résultats d'AZS Alpha Formations : taux de satisfaction, taux de réussite et nombre de stagiaires formés.",
  intro:
    "En tant qu'organisme certifié Qualiopi, nous publions nos indicateurs de résultats. Ils sont mis à jour à la clôture de chaque année civile.",
  period: '2025',
  updatedAt: 'Janvier 2026',
  indicators: [
    { label: 'Taux de satisfaction', value: '100 %', note: 'Mesuré par questionnaire en fin de formation' },
    { label: 'Taux de réussite', value: '100 %', note: 'Sur les formations donnant lieu à une certification' },
    { label: 'Stagiaires formés', value: '11', note: 'Sur l’année civile' },
  ],
  note: "Le faible effectif s'explique par la taille de la structure : les formations sont dispensées en individuel ou en très petit groupe, par une formatrice unique.",
};

export const CONTACT_PAGE = {
  path: '/contact/',
  title: 'Contact',
  summary: `Contacter AZS Alpha Formations à ${SITE.address.city} : téléphone, e-mail, adresse et horaires. Réponse sous 48 heures.`,
  intro:
    "Une question sur une formation, un financement ou une inscription ? Dites-nous où vous en êtes et ce que vous visez : nous répondons sous 48 heures avec une proposition et les pistes de financement mobilisables.",
  about: {
    title: 'Qui suis-je ?',
    paragraphs: [
      "Fin 2020, j'ai décidé de créer mon propre organisme de formation, destiné aussi bien à mes partenaires qu'à mes clients. La qualité du travail a été récompensée par l'obtention de la certification Qualiopi.",
      "L'organisme est ouvert à toute personne désirant développer ou consolider ses compétences en anglais et en français : collégiens, étudiants, salariés, demandeurs d'emploi, seniors.",
      "Chaque programme de formation ou d'accompagnement est adapté à vos objectifs. Toutes nos formations partent d'une approche pédagogique précise et s'appuient sur la qualité des compétences des intervenants.",
    ],
  },
};
