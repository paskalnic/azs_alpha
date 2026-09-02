# AZS Alpha Formations

Site React pré-rendu et publié par Netlify. Les contenus sont des fichiers JSON
et Markdown versionnés dans le dépôt. Le back-office `/admin/` les modifie via
l'API GitHub : aucun CMS ni aucune base de données externe n'est utilisé.

## Fonctionnement du back-office

1. Le client ouvre `https://votre-domaine.fr/admin/` et se connecte avec GitHub.
2. Il modifie une fiche ou dépose un média.
3. « Enregistrer » crée un commit dans la branche de production.
4. GitHub prévient Netlify, qui reconstruit et republie le site.

Les médias sont déposés dans `public/media/`. Les formats JPG, PNG, WebP, GIF,
MP4 et WebM sont acceptés jusqu'à 4 Mo. Le jeton GitHub est conservé dans
`sessionStorage` et disparaît à la fermeture de l'onglet.

## Développement

Prérequis : Node.js 22.

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

La connexion OAuth nécessite les fonctions Netlify. Pour la tester localement,
utiliser `netlify dev` après avoir configuré les variables ci-dessous.

Vérification de production :

```bash
npm run build
npm run preview
```

Le build public, les 25 pages pré-rendues, le sitemap, la page 404 et le
back-office sont générés dans `dist/`.

## Mise en production

### 1. Relier GitHub et Netlify

Importer ce dépôt dans Netlify. Le fichier `netlify.toml` configure déjà :

- la commande `npm run build` ;
- le dossier publié `dist` ;
- Node.js 22 ;
- les fonctions présentes dans `netlify/functions/`.

Activer les déploiements automatiques sur la branche choisie, généralement
`main`.

### 2. Créer l'application OAuth GitHub

Dans GitHub : **Settings → Developer settings → OAuth Apps → New OAuth App**.

- **Homepage URL** : l'URL publique du site ;
- **Authorization callback URL** :
  `https://votre-domaine.fr/.netlify/functions/callback`.

Conserver le **Client ID** et générer un **Client secret**. Le compte du client
doit également être collaborateur du dépôt avec le droit d'écriture.

Décocher **Expire user access tokens** pour cette version du back-office : elle
ne met pas encore en œuvre le renouvellement automatique des jetons. Ne pas
activer **Device Flow** ni la correspondance générique des URL de rappel.

### 3. Ajouter les variables Netlify

Dans **Site configuration → Environment variables**, définir :

| Variable | Valeur |
| --- | --- |
| `VITE_GITHUB_OWNER` | propriétaire ou organisation du dépôt |
| `VITE_GITHUB_REPO` | nom du dépôt, sans URL |
| `VITE_GITHUB_BRANCH` | branche publiée, par défaut `main` |
| `GITHUB_CLIENT_ID` | Client ID de l'application OAuth |
| `GITHUB_CLIENT_SECRET` | secret de l'application OAuth |
| `GITHUB_ALLOWED_USERS` | identifiants GitHub autorisés, séparés par des virgules |
| `GITHUB_SCOPE` | `repo` si le dépôt est privé, `public_repo` s'il est public |

Les variables `VITE_*` sont publiques et injectées dans le JavaScript au build :
ne jamais y placer un secret. `GITHUB_CLIENT_SECRET` doit rester disponible
uniquement côté fonctions Netlify.

Après l'ajout ou la modification des variables, déclencher un nouveau
déploiement Netlify.

### 4. Recette

1. Ouvrir `/admin/` dans une fenêtre privée.
2. Se connecter avec l'un des comptes de `GITHUB_ALLOWED_USERS`.
3. Modifier un texte court et l'enregistrer.
4. Vérifier le commit dans GitHub puis la fin du déploiement Netlify.
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
