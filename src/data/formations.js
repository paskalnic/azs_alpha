/**
 * Catalogue des formations.
 *
 * Contenus repris du site actuel, réécrits et harmonisés : intitulés
 * uniformisés, fautes corrigées, blocs communs factorisés.
 *
 * ⚠ Deux fiches françaises étaient permutées sur le site WordPress
 * (l'URL /remise-a-niveau/ portait le contenu de « Maîtriser les écrits »).
 * Arbitrage retenu : l'URL fait foi, l'intitulé a été corrigé.
 */

import { SITE } from '../site.config';

/* ── Blocs partagés ─────────────────────────────────────────
   Ces informations étaient répétées à l'identique sur chaque fiche du site
   actuel. Les centraliser garantit qu'elles restent cohérentes partout. */

export const FUNDING = [
  {
    id: 'salarie',
    profile: 'Vous êtes salarié·e',
    text: "Prise en charge possible dans le cadre du plan de développement des compétences de votre entreprise. Parlez-en à votre employeur ou à votre service formation.",
  },
  {
    id: 'demandeur',
    profile: "Vous êtes demandeur d'emploi",
    text: "Nous établissons un devis à présenter à votre conseiller France Travail, qui peut mobiliser une aide individuelle à la formation.",
  },
  {
    id: 'particulier',
    profile: 'Vous êtes un particulier',
    text: "L'autofinancement est possible, avec un règlement échelonné sur demande.",
  },
];

export const ACCESS_STEPS = [
  'Prise de contact par téléphone ou par e-mail',
  'Analyse de votre besoin et test de positionnement',
  'Proposition commerciale et devis',
  'Contrat de formation, puis entrée en formation',
];

export const ACCESSIBILITY = {
  title: 'Accessibilité et situation de handicap',
  text: "Nos formations sont accessibles aux personnes en situation de handicap. Lorsqu'un aménagement est nécessaire, nous mobilisons notre réseau de partenaires et d'experts du champ du handicap pour le mettre en place.",
  referent: `Référente handicap : ${SITE.founder.name} — ${SITE.contact.phone}`,
};

export const TRAINER = {
  title: 'Référente pédagogique',
  text: `Chaque formation est placée sous la responsabilité pédagogique de l'organisme. Les sessions sont animées par ${SITE.founder.name}, ${SITE.founder.credentials}.`,
};

export const ROBERT_CERTIFICATION = {
  name: 'Certification Le Robert',
  summary:
    "La Certification Le Robert mesure le niveau de maîtrise du français en contexte professionnel : respect des règles de la langue, précision de l'expression orale et écrite.",
  modalities: [
    'Épreuve 100 % en ligne, à distance ou en centre agréé',
    'Un ordinateur équipé d\'un micro, d\'une webcam et d\'une connexion internet est requis',
    '350 questions réparties en 11 séries, pour une durée maximale de 1 h 45',
    'Le certificat mentionne le score obtenu',
  ],
  validity: 'Validité à vie',
};

/* ── Familles de formation ──────────────────────────────── */

export const CATEGORIES = [
  {
    id: 'anglais',
    path: '/formation-anglais/',
    name: 'Anglais',
    title: 'Formations en anglais',
    icon: '🗣️',
    modifier: 'd1',
    summary:
      'Du TOEIC à la conversation courante, en individuel ou en petit groupe.',
    metaSummary:
      'TOEIC, anglais tourisme, communication courante et anglais général. Organisme Qualiopi à Baie-Mahault, formations finançables.',
    intro:
      "Que vous prépariez une certification, que vous accueilliez une clientèle anglophone ou que vous souhaitiez simplement oser parler, chaque parcours démarre par un test de positionnement et s'adapte à votre niveau réel.",
  },
  {
    id: 'francais',
    path: '/formation-francais/',
    name: 'Français',
    title: 'Formations en français',
    icon: '✍️',
    modifier: 'd2',
    summary:
      "Remise à niveau, écrits professionnels et lutte contre l'illettrisme, avec la Certification Le Robert.",
    metaSummary:
      "Remise à niveau, écrits professionnels, lutte contre l'illettrisme. Certification Le Robert. Organisme Qualiopi à Baie-Mahault.",
    intro:
      "Reprendre les bases, gagner en aisance à l'écrit ou faire reconnaître son niveau : nos parcours en français partent de votre situation, sans jugement, et débouchent sur une certification reconnue.",
  },
  {
    id: 'accueil',
    path: '/formation-en-accueil/',
    name: 'Accueil',
    title: "Formations aux techniques d'accueil",
    icon: '🤝',
    modifier: 'd3',
    summary:
      'La relation client au comptoir comme au téléphone, en secteur touristique et en entreprise.',
    metaSummary:
      "Accueil physique et téléphonique : formations courtes en entreprise. Organisme Qualiopi à Baie-Mahault, finançables.",
    intro:
      "L'accueil est le premier contact avec votre établissement. Ces formations courtes, orientées mise en situation, professionnalisent la posture de vos équipes au comptoir et au téléphone.",
  },
];

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);

/* ── Fiches formation ───────────────────────────────────────
   Les slugs reprennent exactement ceux du site WordPress : le domaine étant
   conservé, aucune redirection n'est nécessaire et le positionnement acquis
   sur ces URL est préservé. */

export const FORMATIONS = [
  /* ═══ ANGLAIS ═══════════════════════════════════════════ */
  {
    id: 'toeic',
    path: '/preparation-au-toeic/',
    category: 'anglais',
    title: 'Préparation au TOEIC',
    shortTitle: 'TOEIC',
    summary:
      "Préparez le TOEIC en 35 heures : format du test, stratégies de score, deux tests blancs et un bilan personnalisé. 950 € en centre, à Baie-Mahault.",
    intro:
      "Reconnu à l'international, le TOEIC (Test of English for International Communication) atteste votre niveau de maîtrise de l'anglais à l'oral comme à l'écrit. Cette formation vous prépare au format de l'épreuve autant qu'à la langue elle-même.",
    duration: { label: '5 jours, 35 heures', hours: 35, iso: 'PT35H' },
    price: { label: '950 € net de TVA par participant', amount: 950, note: 'En regroupement au centre. En intra-entreprise : sur devis.' },
    participants: null,
    modes: ['Présentiel', 'Distanciel avec formateur tuteur en ligne'],
    audience: 'Tout public.',
    prerequisites: 'Aucun prérequis.',
    objectives: {
      main: "Développer ses compétences linguistiques pour communiquer à l'oral et à l'écrit selon les niveaux du CECRL (Cadre européen commun de référence pour les langues), et viser le meilleur score possible au TOEIC.",
      list: [
        'Se familiariser avec le format du test et ses différents types d’exercices',
        'Apprendre à gérer son temps sur chaque partie de l’épreuve',
        'Découvrir les stratégies qui optimisent le score',
        'Approfondir le vocabulaire et la grammaire attendus au test',
        'Comprendre des écrits professionnels et produire un discours cohérent',
      ],
    },
    programme: [
      {
        title: 'Entraînement au format du test',
        items: [
          'Exercices types, au format exact des épreuves du jour J',
          'Présentation des épreuves d’expression écrite et orale, et conseils de méthode',
          'Deux tests blancs en conditions réelles',
        ],
      },
      {
        title: 'Consolidation linguistique',
        items: [
          'Fiches de révision de grammaire et de vocabulaire',
          'Interprétation de sujets concrets et abstraits, à l’écrit comme à l’oral',
          'Compréhension de textes longs et saisie des significations implicites',
          'Expression structurée sur des sujets complexes',
        ],
      },
    ],
    method: [
      'Approche communicative',
      'Travail sur documents authentiques',
      'Différenciation pédagogique selon le niveau de chacun',
    ],
    evaluation: [
      'Test de positionnement au démarrage de la formation',
      'Simulation complète du test TOEIC en fin de parcours',
      'Bilan de formation personnalisé avec score estimé',
      'Attestation de fin de formation (objectifs, durée, résultats)',
    ],
    accessDelay: 'Démarrage dans le mois qui suit la commande, sous réserve des disponibilités de la formatrice.',
  },
  {
    id: 'anglais-tourisme',
    path: '/anglais-tourisme/',
    category: 'anglais',
    title: 'Anglais tourisme',
    shortTitle: 'Anglais tourisme',
    summary:
      "21 heures d'anglais appliqué au tourisme : accueil client, réservations, réclamations. Groupes de 1 à 5 personnes, 950 € net de TVA.",
    intro:
      "Destinée aux professionnels du tourisme, cette formation met l'anglais au service de situations concrètes : accueillir un client, décrire un circuit, gérer une réservation ou répondre à une réclamation.",
    duration: { label: '3 jours, 21 heures', hours: 21, iso: 'PT21H' },
    price: { label: '950 € net de TVA par participant', amount: 950, note: 'Autres formats et demandes spécifiques sur devis.' },
    participants: { min: 1, max: 5 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Toute personne utilisant l'anglais dans un contexte professionnel touristique, quelle que soit sa fonction, souhaitant gagner en aisance opérationnelle.",
    prerequisites: "Connaître les bases de l'anglais (niveau scolaire).",
    objectives: {
      main: "Consolider et mettre en pratique les bases de l'anglais, avec un accent porté sur le vocabulaire et les situations propres au secteur du tourisme.",
      list: [
        'Accueillir et renseigner une clientèle anglophone',
        'Gérer une réservation, une facturation, une confirmation de séjour',
        'Répondre à une réclamation avec le registre approprié',
        'Décrire un voyage, un circuit, un produit touristique et le valoriser',
      ],
    },
    programme: [
      { title: 'Module 1 — Les bases de la langue', items: ['L’essentiel de la grammaire et ses principaux points', 'Le vocabulaire courant et professionnel', 'L’intonation et la prononciation'] },
      { title: 'Module 2 — Vocabulaire', items: ['Vocabulaire courant, puis économique et commercial', 'La correspondance en langue anglaise', "Suivi de l'actualité économique et sociale des pays anglophones"] },
      { title: 'Module 3 — Expression orale', items: ['Entraînement intensif à l’expression orale', 'Reformulation des messages oraux', 'Conversation téléphonique', 'Accueil des clients en anglais'] },
      { title: 'Module 4 — Expression écrite', items: ['Techniques d’écriture', 'Entraînement intensif à l’expression écrite', 'Rédaction de documents professionnels appliqués au tourisme'] },
      { title: 'Module 5 — Cas pratiques', items: ['Communiquer au téléphone', 'Les voyages, les transports, le restaurant, l’hôtel', 'Jeux de rôle', 'L’entretien d’embauche : se présenter, présenter une entreprise'] },
      { title: 'Module 6 — Le tourisme', items: ['Pays et villes étrangères, vocabulaire des voyages', 'Accueillir le client, prendre une commande', 'Réserver un séjour, un vol, un hôtel, une voiture', 'Les transferts touristiques', 'Valoriser un produit touristique et ses points forts', 'Facturer, confirmer un voyage ou un séjour', 'Répondre à une réclamation et savoir présenter ses excuses'] },
    ],
    method: [
      'Exercices pratiques et mises en situation',
      'Supports audio et vidéo',
      'Supports de cours fournis',
    ],
    evaluation: [
      'Suivi continu tout au long de la formation pour valider les progrès',
      'Quiz d’évaluation des acquis pédagogiques',
      'Correction orale et collective avec l’intervenante',
      'Feuille de présence signée à chaque demi-journée',
      'Fiches d’évaluation complétées par la formatrice et par les participants',
      'Support de cours adapté et bilan de formation remis au stagiaire',
      'Attestation de formation',
    ],
    accessDelay: 'Inscription à réaliser au plus tard 15 jours avant le démarrage de la formation.',
  },
  {
    id: 'communication-courante',
    path: '/communication-courante/',
    category: 'anglais',
    title: 'Anglais — communication courante',
    shortTitle: 'Communication courante',
    summary:
      "35 heures pour gagner en aisance à l'oral et à l'écrit en anglais professionnel. Certification English 360 éligible au CPF. 950 € net de TVA.",
    intro:
      "Cette formation vise l'aisance : prendre la parole en réunion, rédiger un e-mail, négocier au téléphone, présenter des chiffres. L'accent est mis sur l'expression et la compréhension orales.",
    duration: { label: '5 jours, 35 heures', hours: 35, iso: 'PT35H' },
    price: { label: '950 € net de TVA par participant', amount: 950, note: 'En regroupement au centre. En intra-entreprise : sur devis.' },
    participants: null,
    modes: ['Présentiel', 'Distanciel avec formateur tuteur en ligne'],
    audience: 'Tout public.',
    prerequisites: "Connaître les bases de l'anglais (niveau scolaire).",
    objectives: {
      main: "Consolider les bases de l'anglais pour atteindre une réelle aisance à l'écrit comme à l'oral, et prendre du plaisir à pratiquer la langue.",
      list: [
        'Gagner en autonomie dans ses interventions professionnelles en anglais',
        'Enrichir le vocabulaire lié à son activité',
        'Participer activement à une réunion et savoir y intervenir',
        'Rédiger notes et e-mails professionnels',
      ],
    },
    programme: [
      { title: 'Les bases de la langue', items: ['L’essentiel de la grammaire et ses principaux points', 'Le vocabulaire courant et professionnel', 'L’intonation et la prononciation'] },
      { title: 'Vocabulaire', items: ['Vocabulaire courant, économique et commercial', 'Maîtrise de la correspondance', "Suivi de l'actualité des pays anglophones"] },
      { title: 'Expression orale', items: ['Entraînement intensif à l’oral', 'Reformulation des messages', 'Conversation téléphonique', 'Accueil des clients en anglais'] },
      { title: 'Expression écrite', items: ['Techniques d’écriture', 'Rédaction de documents professionnels'] },
      { title: 'Cas pratiques', items: ['Communiquer au téléphone', 'Les voyages, les transports, le restaurant, l’hôtel', 'Jeux de rôle', 'L’entretien d’embauche'] },
      { title: 'Cadre professionnel', items: ['Participer activement à des réunions et savoir y intervenir', 'Rédiger des notes et des e-mails', 'Négocier par téléphone', 'Communiquer ses décisions', 'Les rencontres professionnelles', 'Présenter des chiffres'] },
    ],
    method: [
      'Entraînement progressif à la prise de parole en public',
      'Jeux de rôles et mises en situation',
      'Supports de cours fournis',
      'Formatrice expérimentée et diplômée',
    ],
    evaluation: [
      'Suivi continu tout au long de la formation',
      'Quiz d’évaluation des acquis pédagogiques',
      'Correction orale et collective avec l’intervenante',
      'Feuille de présence signée à chaque demi-journée',
      'Support de cours adapté et bilan de formation remis au stagiaire',
    ],
    certification: {
      name: 'Certification English 360',
      summary:
        "Cette formation prépare à la Certification English 360, éligible au compte personnel de formation (CPF).",
      modalities: ['Le passage de la certification est obligatoire dans le cadre d’un financement CPF.'],
    },
    accessDelay: 'Démarrage dans le mois qui suit la commande, sous réserve des disponibilités de la formatrice.',
  },
  {
    id: 'anglais-general-individuel',
    path: '/anglais-general-individuel/',
    category: 'anglais',
    title: 'Anglais général — en individuel',
    shortTitle: 'Anglais général (individuel)',
    summary:
      "30 heures d'anglais général en cours particulier : phonétique, grammaire, vocabulaire professionnel. Un formateur pour vous seul, 1 890 € net de TVA.",
    intro:
      "Un parcours en tête-à-tête, entièrement calibré sur votre niveau et votre secteur d'activité. Le travail sur la phonétique, à l'aide de l'alphabet phonétique international, vise une prononciation claire et comprise du premier coup.",
    duration: { label: '30 heures', hours: 30, iso: 'PT30H' },
    price: { label: '1 890 € net de TVA', amount: 1890, note: 'Autres formats et demandes spécifiques sur devis.' },
    participants: { min: 1, max: 1 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Toute personne utilisant l'anglais dans un contexte professionnel, quelle que soit sa fonction, souhaitant être plus opérationnelle.",
    prerequisites: 'Aucun prérequis.',
    objectives: {
      main: "Améliorer l'anglais courant et professionnel pour communiquer avec aisance dans les situations du quotidien comme du travail.",
      list: [
        'Acquérir les bases linguistiques : automatismes et expressions types',
        "Améliorer sa prononciation grâce à l'alphabet phonétique international",
        'Acquérir le vocabulaire nécessaire pour converser au travail et dans la rue',
        'Lire et rédiger des documents professionnels simples',
        'Entamer et tenir une conversation spontanée avec un anglophone',
      ],
    },
    programme: [
      {
        title: 'Module 1 — Phonétique et lecture (15 heures)',
        items: [
          "Révision de l'alphabet anglais : épeler et sonoriser les mots",
          "Transcrire les mots avec les symboles de l'alphabet phonétique international",
          'Travail sur les systèmes vocalique et consonantique anglais',
          'Approfondissement des phonèmes complexes propres à la langue anglaise',
          "Travail sur la syllabe, l'intonation, le rythme et l'accent tonique",
        ],
      },
      {
        title: 'Module 2 — Vocabulaire et grammaire (15 heures)',
        items: [
          'Se présenter personnellement et professionnellement, formules de politesse',
          "Vocabulaire lié à son secteur d'activité : sur la route, à l'hôtel, avec des clients anglophones",
          'Structures grammaticales de base : interrogation, affirmation, négation',
          'Révision du présent, du passé et du futur',
          'Les verbes modaux et leurs multiples emplois',
          'Acquisition du vocabulaire professionnel',
        ],
      },
    ],
    method: [
      'Séquences pédagogiques regroupées en modules, adaptées aux besoins identifiés en cours de formation',
      'Réflexion et échanges sur cas pratiques, retours d’expériences, jeux de rôle',
      'Lecture de textes pour évaluer prononciation, accent tonique, intonation et rythme',
      'Corrections et contrôles des connaissances à chaque étape, au rythme de l’apprenant',
      'Tableau blanc, paper-board, support de cours numérique projeté puis transmis par e-mail',
    ],
    evaluation: [
      'Évaluation individuelle du profil, des attentes et des besoins avant le démarrage (test de positionnement)',
      'Évaluation des connaissances à chaque étape : questionnaires, exercices, travaux pratiques, entretiens',
      'Questionnaire de satisfaction en fin de formation',
    ],
    fundingExtra: 'CPF, dans le cadre des formations éligibles.',
    accessDelay: 'Inscription à réaliser un mois avant le démarrage de la formation.',
  },
  {
    id: 'anglais-general-groupe',
    path: '/anglais-general-en-groupe/',
    category: 'anglais',
    title: 'Anglais général — en groupe',
    shortTitle: 'Anglais général (groupe)',
    summary:
      "30 heures d'anglais général en petit groupe de 2 à 10 personnes : phonétique, grammaire, vocabulaire professionnel. 1 000 € net de TVA.",
    intro:
      "Le même parcours que la formule individuelle, en petit groupe : la dynamique collective sert les jeux de rôle et les mises en situation, pour un coût par participant nettement réduit.",
    duration: { label: '30 heures', hours: 30, iso: 'PT30H' },
    price: { label: '1 000 € net de TVA', amount: 1000, note: 'Autres formats et demandes spécifiques sur devis.' },
    participants: { min: 2, max: 10 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Toute personne utilisant l'anglais dans un contexte professionnel, quelle que soit sa fonction, souhaitant être plus opérationnelle.",
    prerequisites: 'Aucun prérequis.',
    objectives: {
      main: "Améliorer l'anglais courant et professionnel pour communiquer avec aisance dans les situations du quotidien comme du travail.",
      list: [
        'Acquérir les bases linguistiques : automatismes et expressions types',
        "Améliorer sa prononciation grâce à l'alphabet phonétique international",
        'Acquérir le vocabulaire nécessaire pour converser au travail et dans la rue',
        'Lire et rédiger des documents professionnels simples',
        'Entamer et tenir une conversation spontanée avec un anglophone',
      ],
    },
    programme: [
      {
        title: 'Module 1 — Phonétique et lecture (15 heures)',
        items: [
          "Révision de l'alphabet anglais : épeler et sonoriser les mots",
          "Transcrire les mots avec les symboles de l'alphabet phonétique international",
          'Travail sur les systèmes vocalique et consonantique anglais',
          'Approfondissement des phonèmes complexes propres à la langue anglaise',
          "Travail sur la syllabe, l'intonation, le rythme et l'accent tonique",
        ],
      },
      {
        title: 'Module 2 — Vocabulaire et grammaire (15 heures)',
        items: [
          'Se présenter personnellement et professionnellement, formules de politesse',
          "Vocabulaire lié à son secteur d'activité : sur la route, à l'hôtel, avec des clients anglophones",
          'Structures grammaticales de base : interrogation, affirmation, négation',
          'Révision du présent, du passé et du futur',
          'Les verbes modaux et leurs multiples emplois',
          'Acquisition du vocabulaire professionnel',
        ],
      },
    ],
    method: [
      'Séquences pédagogiques regroupées en modules, adaptées aux besoins identifiés en cours de formation',
      'Réflexion et échanges sur cas pratiques, retours d’expériences, jeux de rôle',
      'Lecture de textes pour évaluer prononciation, accent tonique, intonation et rythme',
      'Corrections et contrôles des connaissances à chaque étape, au rythme des apprenants',
      'Tableau blanc, paper-board, support de cours numérique projeté puis transmis par e-mail',
    ],
    evaluation: [
      'Évaluation individuelle du profil, des attentes et des besoins avant le démarrage (test de positionnement)',
      'Évaluation des connaissances à chaque étape : questionnaires, exercices, travaux pratiques, entretiens',
      'Questionnaire de satisfaction en fin de formation',
    ],
    accessDelay: 'Inscription à réaliser un mois avant le démarrage de la formation.',
  },
  /* ═══ FRANÇAIS ══════════════════════════════════════════ */
  {
    id: 'illettrisme',
    path: '/lutte-contre-lilletrisme/',
    category: 'francais',
    title: "Lutte contre l'illettrisme",
    shortTitle: "Lutte contre l'illettrisme",
    summary:
      "Réapprendre à lire, écrire et s'exprimer en français, jusqu'à la Certification Le Robert. Parcours de 71 h 45, certification incluse, 4 500 €.",
    intro:
      "Un parcours long et progressif, construit à partir d'un diagnostic individuel. On repart des sons et des syllabes pour aller jusqu'à la rédaction de courriers professionnels, sans jugement et au rythme de chacun.",
    duration: { label: '71 h 45 — 10 jours de formation et 1 h 45 de certification', hours: 71.75, iso: 'PT71H45M' },
    price: { label: '4 500 €', amount: 4500, note: "Frais d'inscription à la Certification Le Robert inclus." },
    participants: null,
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Toute personne souhaitant réapprendre les bases de la lecture, de l'écriture et de l'expression en français, dans un cadre personnel ou professionnel.",
    prerequisites:
      "Avoir le français pour langue maternelle ou avoir acquis le niveau A2 (CECRL), et ne pas être en situation d'analphabétisme.",
    objectives: {
      main: "Permettre au stagiaire de se sentir à l'aise avec la langue française, à l'oral comme à l'écrit, et faire reconnaître son niveau par une certification.",
      list: [
        "Rédiger des écrits professionnels en respectant les règles de la langue française",
        "S'exprimer de manière adéquate selon le contexte : registre de langue, vocabulaire, construction des phrases",
        'Comprendre les documents de la vie courante et du monde du travail',
        'Obtenir la Certification Le Robert',
      ],
    },
    programme: [
      { title: '1 — Positionnement initial et diagnostic personnalisé', items: ['Accueil des participants et présentation des objectifs', 'Évaluation des acquis de départ : lecture, écriture, compréhension, expression', 'Définition des besoins individuels et des objectifs personnalisés'] },
      { title: '2 — Réapprentissage des bases de la lecture', items: ['Reconnaissance et association des sons et des syllabes', 'Lecture de mots, de phrases puis de petits textes', 'Compréhension de consignes simples et de documents de la vie courante', 'Lecture guidée et reformulation orale'] },
      { title: '3 — Orthographe et grammaire de base', items: ['Les classes grammaticales : nom, verbe, adjectif, pronom', 'Accords en genre et en nombre', 'Conjugaison des temps essentiels : présent, passé, futur', "Orthographe d'usage et règles simples à mémoriser", 'Exercices d’application et dictées courtes adaptées au niveau'] },
      { title: '4 — Expression orale et vocabulaire', items: ['Développer son vocabulaire du quotidien et professionnel', 'Se présenter, exprimer ses besoins, raconter un fait', 'Dialoguer, poser des questions, reformuler', 'Jeux de rôle et exercices de prononciation, mise en confiance à l’oral'] },
      { title: '5 — Expression écrite fonctionnelle', items: ['Rédaction de phrases courtes puis de petits paragraphes', 'Compléter et rédiger des formulaires simples', 'Rédiger un message, un courrier, un e-mail, une note', 'Connecteurs logiques et ponctuation'] },
      { title: '6 — Communication en contexte professionnel', items: ['Lecture de documents administratifs : bulletins, consignes, affiches, courriels', 'Identification du vocabulaire professionnel courant', 'Rédaction adaptée à une situation de travail', 'Cas concrets : consignes de sécurité, horaires, fiches de poste'] },
      { title: '7 — Préparation à la Certification Le Robert', items: ['Présentation du test, de son format et de ses critères', 'Révision ciblée de grammaire, conjugaison et orthographe', 'Exercices d’entraînement au format du test', 'Test blanc et analyse des résultats', 'Conseils méthodologiques'] },
      { title: '8 — Passage de la Certification Le Robert', items: ['Réalisation du test officiel en ligne', 'Restitution des résultats et attestation de compétences'] },
    ],
    method: [
      'Supports variés : fichiers audio et vidéo, jeux de rôles',
      'Cours individuels dispensés par la même formatrice tout au long du parcours',
      'Salles équipées : tableau, TV, ordinateur, tablette, connexion internet — Teams ou Zoom à distance',
      'Accès illimité à la plateforme e-learning Orthodidacte, qui s’adapte au niveau et au rythme de chacun',
    ],
    evaluation: [
      'Diagnostic individuel avant le démarrage : besoins, niveau initial, personnalisation du programme',
      'Évaluations régulières tout au long du parcours',
      'Certification Le Robert en fin de formation',
    ],
    certification: 'robert',
    accessDelay:
      "Avant le démarrage, la responsable pédagogique vous contacte pour un entretien : diagnostic des besoins, évaluation du niveau initial et personnalisation du programme. La date de démarrage est fixée selon vos disponibilités.",
  },
  {
    id: 'remise-a-niveau',
    path: '/remise-a-niveau/',
    category: 'francais',
    title: 'Remise à niveau en français',
    shortTitle: 'Remise à niveau',
    summary:
      "35 heures pour revoir orthographe, grammaire et conjugaison et déjouer les pièges du français. Certification Le Robert incluse, 990 €.",
    intro:
      "Se réconcilier avec l'orthographe et la grammaire, repérer ses fautes récurrentes et apprendre à les éviter. À l'issue du parcours, vous gagnez en confiance et en crédibilité dans tous vos écrits.",
    duration: { label: '35 heures', hours: 35, iso: 'PT35H' },
    price: {
      label: '990 € par participant',
      amount: 990,
      note: 'En inter-entreprises, en regroupement ou à distance — coût de la Certification Le Robert inclus. En intra-entreprise : sur devis.',
    },
    participants: { min: 1, max: 5 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      'Toute personne ayant des difficultés à rédiger dans un français correct : cadres, secrétaires, commerciaux, techniciens, demandeurs d’emploi.',
    prerequisites:
      "Avoir le français pour langue maternelle ou avoir acquis le niveau A2 (CECRL), et ne pas être en situation d'analphabétisme.",
    objectives: {
      main: "Maîtriser les règles d'orthographe, de grammaire et de conjugaison dans les écrits professionnels, repérer ses fautes les plus courantes et apprendre à les éviter.",
      list: [
        'Accorder correctement noms, adjectifs, participes et verbes',
        'Différencier et écrire correctement les homophones lexicaux et grammaticaux',
        'Employer le registre de langage approprié à la situation de rédaction',
        'Construire des phrases grammaticalement correctes',
        'Obtenir la Certification Le Robert',
      ],
    },
    programme: [
      { title: 'Module 1 — Orthographe', items: ["Les règles d'orthographe spécifiques et l'orthographe d'usage", 'Le pluriel, le féminin et le masculin', "L'écriture des nombres et le trait d'union", 'Accords des noms, adjectifs, participes et verbes', 'Homonymie', 'Ponctuation et signes graphiques', 'Les erreurs courantes, les mots invariables, les adverbes de manière', "Les formules d'usage dans les courriers"] },
      { title: 'Module 2 — Grammaire et conjugaison', items: ['Les règles de la grammaire française', 'Le verbe : accord et conjugaison, les verbes irréguliers', 'Les conjugaisons difficiles des premier et troisième groupes', 'Les auxiliaires être et avoir, la concordance des temps', 'Participe passé et participe présent : quand accorder ?', 'Éviter les confusions : subjonctif/indicatif, conditionnel/futur, temps composés/simples', "L'adjectif, le complément d'objet direct et indirect, l'impératif"] },
      { title: 'Module 3 — Déjouer les pièges de la langue française', items: ['Revoir de façon pratique les règles principales', 'La logique de la langue française et ses pièges', 'Doublement des consonnes, chiffres en lettres', 'Points problématiques : singulier ou pluriel après « de », accord du participe présent, tous/tout', 'Éviter les erreurs de ponctuation', 'Capitales et bas de casse, écriture des chiffres et des nombres', 'Le style des caractères : italique, gras, romain', 'La structure de la phrase'] },
    ],
    method: [
      'Mise en application par des exercices pratiques',
      'Méthode participative, animée par des séances de réflexion',
      'Incitation à la poursuite d’un travail personnel',
    ],
    evaluation: [
      'Test de positionnement au démarrage',
      'Contrôles réguliers des acquis',
      'Certification Le Robert en fin de formation',
    ],
    certification: 'robert',
    accessDelay: 'Inscription à réaliser un mois avant le démarrage de la formation.',
  },
  {
    id: 'maitriser-les-ecrits',
    path: '/maitriser-les-ecrits/',
    category: 'francais',
    title: 'Maîtriser les écrits professionnels',
    shortTitle: 'Maîtriser les écrits',
    summary:
      "35 heures pour rédiger et s'exprimer avec aisance au travail : expression orale et écrite, orthographe, grammaire. Certification Le Robert incluse, 2 100 €.",
    intro:
      "Un parcours complet qui va au-delà des règles : comprendre, résumer, structurer et s'exprimer. Pour celles et ceux qui rédigent courriers, rapports et notes au quotidien et veulent le faire avec assurance.",
    duration: { label: '35 heures', hours: 35, iso: 'PT35H' },
    price: {
      label: '2 100 € la formation',
      amount: 2100,
      note: 'En regroupement au centre — coût de la Certification Le Robert inclus. En intra-entreprise : sur devis.',
    },
    participants: { min: 1, max: 5 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Toute personne ayant des difficultés à rédiger, communiquer et s'exprimer en français.",
    prerequisites:
      "Avoir le français pour langue maternelle ou avoir acquis le niveau A2 (CECRL), et ne pas être en situation d'analphabétisme.",
    objectives: {
      main: "Rédiger avec aisance, s'exprimer avec facilité et communiquer efficacement, à l'écrit comme à l'oral, en contexte professionnel.",
      list: [
        'Maîtriser les règles d’orthographe et de grammaire, savoir conjuguer',
        'Repérer et corriger ses fautes les plus courantes',
        'Structurer et résumer un texte',
        'Employer le registre de langage approprié à la situation',
        'Obtenir la Certification Le Robert',
      ],
    },
    programme: [
      { title: '1 — Expression orale', items: ['Lecture et questions de compréhension autour d’un texte', 'Mises en situation', 'Attribuer correctement aux mots leur sens communément admis', 'Employer le registre de langage approprié', 'Construire des phrases grammaticalement correctes'] },
      { title: '2 — Expression écrite', items: ['Compréhension écrite : répondre correctement à l’écrit', 'Méthodologie du résumé de textes', "Maîtriser les structures de base du courrier et les formules d'usage", 'Déjouer les pièges de la langue française'] },
      { title: '3 — Connaissance des classes de mots', items: ['Les pronoms personnels et les articles', 'Noms propres et noms communs', 'Les genres et les nombres', 'Les groupes de verbes, infinitif et verbes conjugués', 'Les compléments circonstanciels', 'Les adjectifs qualificatifs'] },
      { title: '4 — Orthographe', items: ["L'orthographe d'usage et les règles spécifiques", 'Les erreurs courantes', 'Genre des noms, singulier et pluriel, écriture des nombres', 'Ponctuation et signes graphiques', 'Accords des noms, adjectifs, participes et verbes, homonymie', 'Mots invariables et adverbes de manière'] },
      { title: '5 — Grammaire', items: ['Les règles de grammaire', 'Le verbe : accords et conjugaison', 'Différencier et écrire correctement les homophones'] },
      { title: '6 — Conjugaison', items: ['Conjuguer en respectant temps et modes', 'Accorder le groupe nominal, le verbe avec son sujet, le participe passé', 'Les auxiliaires être et avoir, la concordance des temps', 'Maîtriser les temps usuels de l’indicatif : présent, passé composé, imparfait, passé simple, futur', 'Éviter la confusion entre futur et conditionnel', 'L’impératif'] },
    ],
    method: [
      'Mises en application par des exercices pratiques',
      'Méthode participative animée par des séances de communication écrites et orales',
      'Incitation à la poursuite d’un travail personnel',
      'Support de cours adapté et bilan de formation remis au stagiaire',
    ],
    evaluation: [
      'Suivi continu tout au long de la formation pour valider les progrès',
      'Contrôles réguliers des acquis',
      'Certification Le Robert en fin de formation',
    ],
    certification: 'robert',
    accessDelay: 'Inscription à réaliser un mois avant le démarrage de la formation.',
  },
  /* ═══ ACCUEIL ═══════════════════════════════════════════ */
  {
    id: 'accueil-physique',
    path: '/accueil-physique/',
    category: 'accueil',
    title: "La relation client : l'accueil physique",
    seoTitle: 'Formation accueil physique',
    shortTitle: 'Accueil physique',
    summary:
      "Une journée pour professionnaliser l'accueil au comptoir : communication non verbale, gestion de l'espace, traitement des réclamations. 550 € net de TVA.",
    intro:
      "L'accueil physique est le premier contact avec votre établissement, et souvent celui dont on se souvient. Cette journée travaille la posture, la communication non verbale et la conduite d'entretien face à tous les profils d'interlocuteurs.",
    duration: { label: '1 jour, 7 heures', hours: 7, iso: 'PT7H' },
    price: { label: '550 € net de TVA la journée', amount: 550, note: 'Tarif intra-entreprise. Autres formats et demandes spécifiques sur devis.' },
    participants: null,
    modes: ['Présentiel'],
    audience:
      "Personnes en situation d'accueil physique : réception, accueil, vendeurs en point de vente.",
    prerequisites: 'Personnes débutantes dans la fonction.',
    objectives: {
      main: "Professionnaliser l'accueil physique pour véhiculer une image de qualité de service et mieux satisfaire les clients et usagers.",
      list: [
        "Mesurer les enjeux de la qualité de service sur l'image de l'établissement",
        'Identifier les attentes des clients et des usagers en accueil physique',
        'Maîtriser la communication verbale et non verbale : allure, gestuelle, synchronisation',
        "Gérer l'espace d'accueil et la distance à l'interlocuteur",
        'Structurer un entretien et aboutir à une solution puis à un engagement',
        'Traiter une réclamation avec méthode',
      ],
    },
    programme: [
      {
        title: 'Comprendre les enjeux de la qualité de service',
        items: ["Sur l'image de l'établissement", "Sur l'organisation", 'Sur la stratégie', 'Sur votre propre mission et votre niveau de stress'],
      },
      {
        title: 'Les bases de la relation client',
        items: [
          'Les attentes des clients et des usagers en accueil physique',
          "La communication verbale et non verbale : l'allure, la gestuelle, les autres sens de la communication",
          "La gestion de l'espace : le sien, celui de l'usager, l'espace d'accueil en général",
          'La synchronisation avec son interlocuteur',
          'Les lois de la directivité par le mouvement',
        ],
      },
      {
        title: "Conduire l'entretien",
        items: [
          'Savoir isoler',
          'Aboutir à une solution puis à un engagement',
          "Structurer son entretien selon les types d'entretiens et d'interlocuteurs",
          'Un cas particulier : la réclamation',
        ],
      },
    ],
    method: [
      'Méthode interactive et participative, appuyée sur les expériences professionnelles des participants',
      'Apports théoriques illustrés par des exemples concrets et réels',
      'Jeux de rôles et simulations',
      'Exercices individuels et collectifs',
    ],
    evaluation: [
      "Quiz d'évaluation des acquis pédagogiques",
      "Correction orale et collective avec l'intervenante",
      'Feuille de présence signée à chaque demi-journée',
      'Fiches d’évaluation complétées par la formatrice et par les participants',
      'Attestation de formation',
    ],
    accessDelay: 'Démarrage dans le mois qui suit la commande, sous réserve des disponibilités de la formatrice.',
  },
  {
    id: 'accueil-telephonique',
    path: '/accueil-telephonique/',
    category: 'accueil',
    title: "La relation client : l'accueil téléphonique",
    seoTitle: 'Formation accueil téléphonique',
    shortTitle: 'Accueil téléphonique',
    summary:
      "Une journée pour structurer l'accueil téléphonique : attitude, étapes de l'appel, traitement de la demande. Groupes de 4 à 10 personnes, 550 € net de TVA.",
    intro:
      "Un accueil téléphonique de qualité est un moyen simple et peu coûteux de développer une image positive de votre établissement. Cette journée en donne la méthode, du premier mot au transfert d'appel.",
    duration: { label: '1 jour, 7 heures', hours: 7, iso: 'PT7H' },
    price: { label: '550 € net de TVA la journée', amount: 550, note: 'Tarif intra-entreprise, pour 4 à 10 apprenants. Autres formats sur devis.' },
    participants: { min: 4, max: 10 },
    modes: ['Présentiel', 'Distanciel'],
    audience:
      "Personnes en situation d'accueil téléphonique : réception, accueil, vendeurs en point de vente.",
    prerequisites: 'Aucun prérequis. Formation ouverte à tout public.',
    objectives: {
      main: "Professionnaliser la relation téléphonique pour véhiculer une image de qualité de service et mieux satisfaire les clients.",
      list: [
        'Rappeler les enjeux de la relation téléphonique',
        'Améliorer et maintenir une démarche proactive sur les appels entrants',
        'Être concret et savoir terminer un appel',
        'Optimiser la gestion simultanée des tâches administratives et des appels',
      ],
    },
    programme: [
      { title: 'Module 1 — Une attitude positive dès le premier mot', items: ["Réussir l'accueil téléphonique dans différentes situations", 'Développer une attitude positive dès le début de la conversation'] },
      { title: 'Module 2 — Les étapes d’un accueil de qualité', items: ['Construire les différentes étapes à suivre', 'Le transfert d’appel, la prise de message'] },
      { title: 'Module 3 — Les mots qui comptent', items: ['Expressions et mots à bannir lors d’un entretien téléphonique'] },
      { title: 'Module 4 — Analyser et traiter la demande', items: ['Analyse de la demande du client', 'Traitement et réponse adaptée'] },
      { title: 'Module 5 — Mise en pratique', items: ['Mise en pratique de l’ensemble des méthodes vues dans la journée'] },
    ],
    method: [
      "Trois modes pédagogiques : acquisition de l'information, expérimentation, appropriation",
      'Animation centrée sur des mises en situation issues de cas concrets vécus en entreprise',
      'Exercices et études de cas, apports de méthode',
      'Moyens audiovisuels et informatiques',
    ],
    evaluation: [
      "Quiz d'évaluation des acquis pédagogiques",
      "Correction orale et collective avec l'intervenante",
      'Feuille de présence signée à chaque demi-journée',
      'Fiches d’évaluation complétées par la formatrice et par les participants',
      'Attestation de formation',
    ],
    accessDelay: 'Inscription à réaliser au plus tard un mois avant le démarrage de la formation.',
  },
];

/* ── Emplacements média ─────────────────────────────────────
   Chaque fiche reçoit un emplacement vide, adressable par son identifiant
   (`formation-toeic`, `formation-illettrisme`…). Renseigner `src` — image,
   GIF ou vidéo — depuis le back-office suffira à le remplir. */

for (const f of FORMATIONS) {
  if (!f.media) {
    f.media = {
      id: `formation-${f.id}`,
      kind: 'image',
      src: null,
      alt: '',
      ratio: '16/10',
      label: f.shortTitle,
    };
  }
}

/* ── Accès ──────────────────────────────────────────────── */

export const getFormation = (path) => FORMATIONS.find((f) => f.path === path);
export const formationsOf = (categoryId) => FORMATIONS.filter((f) => f.category === categoryId);
export const CERTIFICATIONS = { robert: ROBERT_CERTIFICATION };
export const certificationOf = (f) =>
  typeof f.certification === 'string' ? CERTIFICATIONS[f.certification] : f.certification;
