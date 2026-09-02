/**
 * Accès au dépôt via l'API GitHub.
 *
 * Chaque enregistrement écrit un fichier et crée un commit signé du compte
 * connecté : l'historique des modifications est donc daté et nominatif, et
 * la republication du site se déclenche d'elle-même.
 */

const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function createClient({ token, owner, repo, branch }) {
  const encodedBranch = encodeURIComponent(branch);
  const repoPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const contentPath = (path) => path.split('/').map(encodeURIComponent).join('/');

  const request = async (path, options = {}) => {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      throw new GitHubError('Session expirée. Reconnectez-vous.', 401);
    }
    if (response.status === 403) {
      throw new GitHubError("Accès refusé : ce compte n'a pas les droits d'écriture sur le dépôt.", 403);
    }
    if (!response.ok && ![404, 409, 422].includes(response.status)) {
      const body = await response.json().catch(() => ({}));
      throw new GitHubError(body.message || `Erreur GitHub (${response.status})`, response.status);
    }
    return response;
  };

  /* — Encodage : btoa ne gère que le latin-1, et nos contenus sont en UTF-8 — */
  const toBase64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const fromBase64 = (base64) => {
    const binary = atob(base64.replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };

  return {
    /** Identité du compte connecté, pour l'afficher et vérifier le jeton. */
    async me() {
      const response = await request('/user');
      return response.json();
    },

    /** Liste les fichiers d'un dossier du dépôt. */
    async list(dir) {
      const response = await request(`${repoPath}/contents/${contentPath(dir)}?ref=${encodedBranch}`);
      if (response.status === 404) return [];
      return response.json();
    },

    /** Lit un fichier texte. Retourne aussi son `sha`, requis pour le réécrire. */
    async read(path) {
      const response = await request(`${repoPath}/contents/${contentPath(path)}?ref=${encodedBranch}`);
      if (response.status === 404) return null;
      const data = await response.json();
      return { text: fromBase64(data.content), sha: data.sha, path: data.path };
    },

    /**
     * Écrit un fichier texte et crée un commit.
     * `sha` est celui de la version lue : GitHub refuse l'écriture s'il a
     * changé entre-temps, ce qui empêche d'écraser la modification d'autrui.
     */
    async write({ path, text, sha, message }) {
      const response = await request(`${repoPath}/contents/${contentPath(path)}`, {
        method: 'PUT',
        body: JSON.stringify({
          message,
          content: toBase64(text),
          branch,
          ...(sha ? { sha } : {}),
        }),
      });
      if (response.status === 409 || response.status === 422) {
        throw new GitHubError(
          'Ce fichier a été modifié entre-temps. Rechargez la page avant d’enregistrer.',
          response.status,
        );
      }
      return response.json();
    },

    /** Dépose un fichier binaire (image, GIF) déjà encodé en base64. */
    async writeBinary({ path, base64, sha, message }) {
      const response = await request(`${repoPath}/contents/${contentPath(path)}`, {
        method: 'PUT',
        body: JSON.stringify({ message, content: base64, branch, ...(sha ? { sha } : {}) }),
      });
      if (response.status === 409 || response.status === 422) {
        throw new GitHubError('Un média du même nom existe déjà. Réessayez le dépôt.', response.status);
      }
      return response.json();
    },
  };
}
