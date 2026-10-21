/**
 * Retour d'authentification GitHub — Cloudflare Pages Function, servie à
 * /api/callback.
 *
 * Échange le code temporaire contre un jeton d'accès, puis le transmet à la
 * fenêtre qui a ouvert la connexion. Le jeton ne transite pas par l'URL — il
 * passe par postMessage, ce qui l'empêche d'atterrir dans l'historique du
 * navigateur ou dans les journaux du serveur.
 *
 * Deux différences avec la version Netlify, toutes deux nécessaires :
 *
 * - **`User-Agent` sur chaque appel à GitHub.** L'API GitHub refuse toute
 *   requête qui n'en porte pas. Node en ajoute un tout seul, le moteur de
 *   Cloudflare non : sans cette ligne, la connexion échouait sur un 403
 *   alors que l'identifiant et le secret étaient justes.
 * - **La page renvoyée contient le jeton.** Elle part donc avec
 *   `Cache-Control: no-store` : aucun cache intermédiaire ne doit la garder.
 *   Les en-têtes de `public/_headers` ne s'appliquent qu'aux fichiers
 *   statiques ; cette réponse-ci pose les siens.
 */
const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'AZS-Alpha-Formations-admin',
};

const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const page = (payload, origin) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>Connexion…</title></head>
<body style="font-family:system-ui;padding:2rem;color:#12303E">
<p>Connexion en cours…</p>
<script>
  (function () {
    var payload = ${safeJson(payload)};
    if (window.opener) {
      window.opener.postMessage({ source: 'azs-admin-auth', payload: payload }, ${JSON.stringify(origin)});
      window.close();
    } else {
      document.querySelector('p').textContent = payload.error || 'Connexion réussie. Vous pouvez fermer cette fenêtre.';
    }
  })();
</script>
</body></html>`;

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookies = Object.fromEntries(
    (request.headers.get('cookie') || '').split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    }),
  );

  const html = (payload) =>
    new Response(page(payload, url.origin), {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
      },
    });

  if (!code) return html({ error: 'Autorisation refusée ou annulée.' });
  if (!state || state !== cookies.oauth_state) {
    return html({ error: 'Jeton de sécurité invalide. Relancez la connexion.' });
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return html({ error: 'Configuration GitHub incomplète sur Cloudflare Pages.' });
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': GITHUB_HEADERS['User-Agent'],
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error || !data.access_token) {
    return html({ error: data.error_description || "Échec de l'échange du jeton." });
  }

  const allowedUsers = (env.GITHUB_ALLOWED_USERS || '')
    .split(',')
    .map((login) => login.trim().toLowerCase())
    .filter(Boolean);

  if (allowedUsers.length) {
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { ...GITHUB_HEADERS, Authorization: `Bearer ${data.access_token}` },
    });
    const user = await userResponse.json().catch(() => ({}));
    if (!userResponse.ok || !allowedUsers.includes(user.login?.toLowerCase())) {
      return html({ error: "Ce compte GitHub n'est pas autorisé à administrer ce site." });
    }
  }

  const owner = env.VITE_GITHUB_OWNER;
  const repo = env.VITE_GITHUB_REPO;
  if (owner && repo) {
    const repoResponse = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      { headers: { ...GITHUB_HEADERS, Authorization: `Bearer ${data.access_token}` } },
    );
    const repository = await repoResponse.json().catch(() => ({}));
    if (!repoResponse.ok || !repository.permissions?.push) {
      return html({ error: "Ce compte GitHub n'a pas le droit de modifier le dépôt du site." });
    }
  }
  return html({ token: data.access_token });
}
