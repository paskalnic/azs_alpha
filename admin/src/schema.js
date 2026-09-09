/**
 * Description du contenu éditable.
 *
 * Les formulaires sont engendrés à partir de ces déclarations : ajouter un
 * champ à une fiche se fait ici, pas dans l'interface. Le schéma doit rester
 * accordé à la forme des fichiers de `content/` — un champ absent d'ici ne
 * serait pas affiché, mais il est préservé à l'enregistrement (voir merge()).
 */

const text = (name, label, extra = {}) => ({ name, label, type: 'text', ...extra });
const area = (name, label, extra = {}) => ({ name, label, type: 'textarea', ...extra });
const list = (name, label, of, extra = {}) => ({ name, label, type: 'list', of, ...extra });
const object = (name, label, fields, extra = {}) => ({ name, label, type: 'object', fields, ...extra });

/* — Blocs réutilisés par plusieurs collections — */

const MEDIA = object('media', 'Image ou vidéo', [
  { name: 'src', label: 'Fichier', type: 'media' },
  text('alt', 'Texte alternatif', {
    help: "Décrit l'image pour les personnes qui ne la voient pas. À laisser vide si l'image est purement décorative.",
  }),
  text('label', 'Libellé affiché tant que la zone est vide'),
]);

export const COLLECTIONS = [
  {
    id: 'formations',
    label: 'Formations',
    type: 'folder',
    path: 'content/formations',
    format: 'json',
    titleField: 'title',
    description: "Une fiche par formation. Le nom du fichier et le champ « Adresse de la page » ne doivent pas changer : ils déterminent l'URL, déjà référencée par les moteurs de recherche.",
    fields: [
      text('title', 'Intitulé'),
      text('shortTitle', 'Intitulé court', { help: 'Utilisé dans les listes et le fil d’Ariane.' }),
      text('seoTitle', 'Titre pour les moteurs de recherche', {
        optional: true,
        help: 'Facultatif. Sert quand l’intitulé complet dépasse 65 caractères.',
      }),
      area('summary', 'Résumé', {
        max: 160,
        help: 'Texte affiché dans les résultats de recherche. 160 caractères au maximum.',
      }),
      area('intro', 'Introduction', { rows: 4 }),
      MEDIA,
      object('duration', 'Durée', [
        text('label', 'Affichée', { help: 'Par exemple : 5 jours, 35 heures' }),
        { name: 'hours', label: 'Nombre d’heures', type: 'number' },
        text('iso', 'Format normalisé', { help: 'Pour les moteurs de recherche. Exemple : PT35H' }),
      ]),
      object('price', 'Tarif', [
        text('label', 'Affiché'),
        { name: 'amount', label: 'Montant', type: 'number' },
        area('note', 'Précision', { rows: 2 }),
      ]),
      object('participants', 'Effectif', [
        { name: 'min', label: 'Minimum', type: 'number' },
        { name: 'max', label: 'Maximum', type: 'number' },
      ], { nullable: true, help: 'Laisser vide affichera « Nous consulter ».' }),
      list('modes', 'Modalités', { type: 'text' }),
      area('audience', 'Public concerné', { rows: 3 }),
      area('prerequisites', 'Prérequis', { rows: 2 }),
      object('objectives', 'Objectifs', [
        area('main', 'Objectif principal', { rows: 3 }),
        list('list', 'Objectifs détaillés', { type: 'text' }),
      ]),
      list('programme', 'Programme', {
        type: 'object',
        titleField: 'title',
        fields: [text('title', 'Titre du module'), list('items', 'Contenu', { type: 'text' })],
      }),
      list('method', 'Méthodes pédagogiques', { type: 'text' }),
      list('evaluation', 'Modalités d’évaluation', { type: 'text' }),
      area('accessDelay', 'Délais d’accès', { rows: 3 }),
      text('fundingExtra', 'Mention de financement complémentaire', { optional: true }),
      text('path', 'Adresse de la page', { readOnly: true }),
      { name: 'category', label: 'Famille', type: 'select', options: ['anglais', 'francais', 'accueil'] },
      { name: 'order', label: 'Ordre d’affichage', type: 'number' },
    ],
  },
  {
    id: 'settings',
    label: 'Coordonnées et identité',
    type: 'file',
    path: 'content/settings.json',
    format: 'json',
    description: "Ces informations alimentent tout le site : pied de page, page contact, fiches et données structurées. Les modifier ici les met à jour partout.",
    fields: [
      text('name', 'Nom affiché'),
      text('legalName', 'Raison sociale'),
      text('tagline', 'Accroche'),
      area('description', 'Description du site', { max: 160 }),
      object('contact', 'Contact', [
        text('email', 'Adresse e-mail'),
        text('phone', 'Téléphone affiché'),
        text('phoneE164', 'Téléphone au format international', { help: 'Pour les liens d’appel. Exemple : +590690757226' }),
        text('hours', 'Horaires'),
      ]),
      object('address', 'Adresse', [
        text('street', 'Voie'),
        text('postalCode', 'Code postal'),
        text('city', 'Commune'),
        text('region', 'Région'),
        text('country', 'Pays', { help: 'Code à deux lettres. Exemple : FR' }),
      ]),
      object('founder', 'Responsable', [
        text('name', 'Nom'),
        text('role', 'Fonction'),
        text('credentials', 'Qualifications'),
      ]),
      object('certification', 'Certification', [
        text('name', 'Nom'),
        text('scope', 'Portée'),
        area('label', 'Mention affichée', { rows: 2 }),
        text('number', 'Numéro du certificat', { optional: true }),
        text('validUntil', 'Valable jusqu’au', { optional: true, help: 'Par exemple : 31 décembre 2027' }),
        { name: 'document', label: 'Certificat officiel', type: 'document', optional: true },
      ]),
    ],
  },
  {
    id: 'home',
    label: 'Page d’accueil',
    type: 'file',
    path: 'content/pages/home.json',
    format: 'json',
    description: "Les principaux textes et le portrait d’accueil. Les éléments techniques et la navigation sont conservés automatiquement.",
    fields: [
      object('hero', 'En-tête de la page', [
        text('eyebrow', 'Sur-titre'),
        area('lead', 'Introduction', { rows: 4 }),
        list('cards', 'Cartes de l’en-tête', {
          type: 'object',
          titleField: 'role',
          fields: [
            text('role', 'Métier', { help: 'Inscrit dans le coin de la carte quand l’éventail s’ouvre.' }),
            MEDIA,
          ],
        }, {
          help: 'Trois cartes empilées. La première est affichée devant ; les autres se découvrent au survol.',
        }),
      ]),
      object('formations', 'Présentation des formations', [
        text('title', 'Titre'),
        area('description', 'Description', { rows: 3 }),
      ]),
      object('promise', 'Promesse', [
        text('eyebrow', 'Sur-titre'),
        area('quoteHtml', 'Citation', { rows: 4, help: 'Les balises simples déjà présentes sont conservées.' }),
        list('paragraphsHtml', 'Paragraphes', { type: 'text' }),
      ]),
      object('why', 'Pourquoi nous choisir', [
        text('eyebrow', 'Sur-titre'),
        text('title', 'Titre'),
        object('feature', 'Argument principal', [text('title', 'Titre'), area('text', 'Texte', { rows: 3 })]),
        list('tiles', 'Arguments complémentaires', {
          type: 'object',
          titleField: 'title',
          fields: [text('title', 'Titre'), area('text', 'Texte', { rows: 2 })],
        }),
      ]),
      object('testimonial', 'Témoignage', [
        area('quote', 'Citation', { rows: 4 }),
        object('author', 'Auteur', [text('name', 'Nom'), text('role', 'Formation suivie')]),
      ]),
      object('financement', 'Financement', [
        text('eyebrow', 'Sur-titre'),
        text('title', 'Titre'),
        area('description', 'Description', { rows: 3 }),
        list('items', 'Situations', {
          type: 'object',
          titleField: 'title',
          fields: [text('title', 'Titre'), area('text', 'Texte', { rows: 2 })],
        }),
      ]),
      object('finalCta', 'Appel à l’action final', [
        text('title', 'Titre'),
        area('text', 'Texte', { rows: 3 }),
      ]),
    ],
  },
  {
    id: 'contact',
    label: 'Page contact',
    type: 'file',
    path: 'content/pages/contact.json',
    format: 'json',
    fields: [
      text('title', 'Titre'),
      area('summary', 'Résumé pour les moteurs de recherche', { max: 160 }),
      area('intro', 'Introduction', { rows: 4 }),
      object('about', 'Présentation', [
        text('title', 'Titre'),
        MEDIA,
        list('paragraphs', 'Paragraphes', { type: 'text' }),
      ]),
    ],
  },
  {
    id: 'quality',
    label: 'Engagements qualité',
    type: 'file',
    path: 'content/pages/quality.json',
    format: 'json',
    fields: [
      text('title', 'Titre'),
      area('summary', 'Résumé pour les moteurs de recherche', { max: 160 }),
      area('intro', 'Introduction', { rows: 4 }),
      list('pillars', 'Axes de la démarche qualité', {
        type: 'object',
        titleField: 'title',
        fields: [text('title', 'Titre'), area('text', 'Texte', { rows: 2 })],
      }),
      list('commitments', 'Engagements', {
        type: 'object',
        titleField: 'title',
        fields: [text('title', 'Titre'), list('items', 'Détails', { type: 'text' })],
      }),
    ],
  },
  {
    id: 'results',
    label: 'Nos résultats',
    type: 'file',
    path: 'content/pages/results.json',
    format: 'json',
    description: "Indicateurs publiés au titre de la certification Qualiopi. À mettre à jour à la clôture de chaque année civile.",
    fields: [
      text('title', 'Titre de la page'),
      area('summary', 'Résumé', { max: 160 }),
      area('intro', 'Introduction', { rows: 3 }),
      text('period', 'Année de référence'),
      text('updatedAt', 'Dernière mise à jour'),
      list('indicators', 'Indicateurs', {
        type: 'object',
        titleField: 'label',
        fields: [text('label', 'Intitulé'), text('value', 'Valeur'), text('note', 'Précision')],
      }),
      area('note', 'Commentaire', { rows: 3 }),
    ],
  },
  {
    id: 'legal',
    label: 'Pages légales',
    type: 'folder',
    path: 'content/legal',
    format: 'markdown',
    titleField: 'title',
    description: "Documents contractuels. Le corps s'écrit en Markdown : « ## » pour une section, « ### » pour un article, « - » pour une puce.",
    fields: [
      text('title', 'Titre'),
      text('seoTitle', 'Titre pour les moteurs de recherche', { optional: true }),
      area('summary', 'Résumé', { max: 160 }),
      { name: 'body', label: 'Contenu', type: 'markdown' },
      text('path', 'Adresse de la page', { readOnly: true }),
      { name: 'order', label: 'Ordre d’affichage', type: 'number' },
    ],
  },
];

export const getCollection = (id) => COLLECTIONS.find((c) => c.id === id);
