# AZ Services Alpha Formations

Site React pré-rendu et publié par Cloudflare Pages. Les contenus sont des
fichiers JSON et Markdown versionnés dans le dépôt. Le back-office `/admin/` les
modifie via l'API GitHub : aucun CMS ni aucune base de données externe n'est
utilisé.

## Fonctionnement du back-office

1. La cliente ouvre `https://votre-domaine.fr/admin/` et se connecte avec GitHub.
2. Elle modifie une fiche ou dépose un média.
3. « Enregistrer » crée un commit dans la branche de production.
4. GitHub prévient Cloudflare Pages, qui reconstruit et republie le site.

Une formation se crée depuis « Formations → Nouvelle formation », par copie
d'une fiche existante. Elle naît en brouillon (`"draft": true`) : le site
l'ignore entièrement — ni page, ni catalogue, ni sitemap — tant que la case
n'est pas décochée. L'adresse est choisie à la création et ne change plus ;
le back-office refuse celles que le site utilise déjà. « Retirer cette
formation » supprime le fichier : la page répond alors en 404. Retirer une des
fiches d'origine fait échouer `scripts/verifier-site.sh`, qui surveille les
adresses de l'ancien site ; il faut alors l'en ôter, ou ajouter une
redirection dans `public/_redirects` si une autre page la remplace.

Le plan gratuit de Pages autorise 500 builds par mois. Chaque enregistrement en
consomme un : c'est la limite à surveiller, bien avant la bande passante, qui
n'est pas plafonnée.

Les médias sont déposés dans `public/media/`. Les formats JPG, PNG, WebP, GIF,
MP4 et WebM sont acceptés jusqu'à 4 Mo. Le certificat Qualiopi peut être déposé
en PDF depuis « Coordonnées et identité » et vit dans `public/documents/`. Le
jeton GitHub est conservé dans `sessionStorage` et disparaît à la fermeture de
l'onglet.

## Développement

Prérequis : Node.js 22 (fixé par `.node-version`).

```bash
npm install
cp .env.example .env.local
npm run dev
```

L'interface publique est alors servie par Vite. Pour travailler uniquement sur
l'interface d'administration :

```bash
npm run dev:admin
```

La connexion OAuth repose sur les Pages Functions de `functions/api/`. Pour la
tester en local, construire le site puis le servir avec Wrangler, qui exécute
aussi les fonctions et applique `_headers`, `_redirects` et `_routes.json` :

```bash
npm run build
npx wrangler pages dev dist
```

Les variables se placent alors dans un fichier `.dev.vars`, à la racine. Il est
exclu du dépôt par `.gitignore` : il contient le secret OAuth, et le dépôt est
public.

Vérification d'un déploiement, en ligne :

```bash
bash scripts/verifier-site.sh                              # le domaine
bash scripts/verifier-site.sh https://azs-alpha.pages.dev  # l'adresse Pages
```

## Mise en production

### 1. Créer le projet Cloudflare Pages

Dans Cloudflare, **Workers & Pages**, créer une application de type **Pages**
reliée au dépôt GitHub `paskalnic/azs_alpha`, avec :

| Réglage | Valeur |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |

Lors de l'autorisation GitHub, ne donner accès qu'à ce dépôt. Le reste de la
configuration est versionné :

- `public/_headers` — en-têtes de sécurité, cache des fichiers versionnés,
  fermeture de `/admin/` aux moteurs et aux caches ;
- `public/_redirects` — la redirection de `/inscription-formation/` ;
- `public/_routes.json` — **seules les adresses `/api/*` exécutent du code**.
  Sans ce fichier, Pages ferait passer chaque page vue par les fonctions,
  limitées à 100 000 requêtes par jour sur le plan gratuit ; au-delà, le site
  entier répondrait en erreur. Avec lui, les pages restent des fichiers
  statiques, gratuits et sans quota ;
- `functions/api/` — les deux fonctions de connexion GitHub.

### 2. Créer l'application OAuth GitHub

Dans GitHub : **Settings → Developer settings → OAuth Apps → New OAuth App**.

- **Homepage URL** : l'URL publique du site ;
- **Authorization callback URL** : `https://votre-domaine.fr/api/callback`.

Une application OAuth n'accepte qu'**une** URL de rappel. Avant le raccordement
du domaine, utiliser l'adresse `.pages.dev` ; le jour du raccordement, remplacer
les deux URL par celles du domaine.

Conserver le **Client ID** et générer un **Client secret**. Le compte de la
cliente doit également être collaborateur du dépôt avec le droit d'écriture.

Décocher **Expire user access tokens** pour cette version du back-office : elle
ne met pas encore en œuvre le renouvellement automatique des jetons. Ne pas
activer **Device Flow** ni la correspondance générique des URL de rappel.

### 3. Ajouter les variables

Dans le projet Pages, **Settings → Variables and Secrets**, pour la production :

| Variable | Valeur |
| --- | --- |
| `VITE_GITHUB_OWNER` | `paskalnic` |
| `VITE_GITHUB_REPO` | `azs_alpha` |
| `VITE_GITHUB_BRANCH` | `main` |
| `GITHUB_CLIENT_ID` | Client ID de l'application OAuth |
| `GITHUB_CLIENT_SECRET` | secret de l'application OAuth, en type **Secret** |
| `GITHUB_ALLOWED_USERS` | identifiants GitHub autorisés, séparés par des virgules |
| `GITHUB_SCOPE` | facultatif : `public_repo` par défaut ; `repo` si le dépôt redevient privé |

Les variables `VITE_*` sont publiques et injectées dans le JavaScript au build :
ne jamais y placer un secret. Toutes les variables sont aussi lues par les
fonctions, à l'exécution.

Après l'ajout ou la modification d'une variable, relancer un déploiement :
un site déjà construit ne voit pas les nouvelles valeurs `VITE_*`.

### 4. Raccorder le domaine

Pages n'accepte un domaine racine (`azsalphaformations.com`) que si sa zone DNS
est chez Cloudflare. Le raccordement consiste donc à :

1. ajouter le domaine dans Cloudflare (plan Free), qui importe les
   enregistrements existants ;
2. comparer l'import à l'inventaire de la zone actuelle et recréer ce qui
   manque — en particulier les enregistrements des e-mails : les trois MX,
   le SPF, `_dmarc` et la signature DKIM `default._domainkey` ;
3. passer en **DNS only** (nuage gris) `mail`, `ftp`, `autodiscover`,
   `autoconfig` et `default._domainkey` : le proxy de Cloudflare ne transporte
   que le web ;
4. ajouter le domaine et `www` dans **Custom domains** du projet Pages ;
5. remplacer, chez le registrar, les serveurs de noms par ceux fournis par
   Cloudflare ;
6. une fois le domaine actif et le certificat délivré, lancer
   `bash scripts/verifier-site.sh`.

Le détail, avec l'inventaire relevé, est dans le guide de livraison.

### 5. Recette

1. Ouvrir `/admin/` dans une fenêtre privée.
2. Se connecter avec l'un des comptes de `GITHUB_ALLOWED_USERS`.
3. Modifier un texte court et l'enregistrer.
4. Vérifier le commit dans GitHub puis la fin du déploiement Pages.
5. Vérifier la modification sur le site public et remettre le texte initial si
   le test ne doit pas être conservé.

## Où vivent les contenus ?

- `content/formations/` : une fiche JSON par formation ;
- `content/pages/` : accueil, contact, qualité et résultats ;
- `content/legal/` : pages légales en Markdown avec en-tête ;
- `content/settings.json` : identité, adresse et coordonnées ;
- `content/shared.json` et `content/categories.json` : données réutilisées.

Le schéma des formulaires est dans `admin/src/schema.js`. Un champ absent du
schéma n'est pas affiché mais reste préservé lors de l'enregistrement.
