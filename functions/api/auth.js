/**
 * Démarrage de l'authentification GitHub — Cloudflare Pages Function.
 *
 * Servie à /api/auth : dans Pages, le chemin d'un fichier sous `functions/`
 * est son URL. Redirige vers la page d'autorisation de GitHub. Le secret
 * client ne quitte jamais le serveur : seul l'identifiant public circule ici.
 *
 * Variables (Cloudflare → Workers & Pages → le projet → Settings →
 * Variables and Secrets) :
 *   GITHUB_CLIENT_ID      identifiant de l'application OAuth
 *   GITHUB_CLIENT_SECRET  son secret, en type « Secret » (lu par callback.js)
 *   GITHUB_SCOPE          facultatif, `public_repo` par défaut
 *
 * Pages n'expose pas `process.env` : les variables arrivent dans `env`.
 *
 * Seules les adresses /api/* réveillent ce code : `public/_routes.json` le
 * déclare. Sans lui, Pages ferait passer chaque page vue par les Functions,
 * qui sont limitées à 100 000 requêtes par jour sur le plan gratuit — et au
 * delà, c'est le site entier qui répondrait en erreur.
 */
export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Configuration incomplète : GITHUB_CLIENT_ID n'est pas défini.", {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const url = new URL(request.url);
  // jeton anti-rejeu, revérifié au retour
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  // Le dépôt est public : `public_repo` suffit pour y écrire, et c'est le droit
  // le plus étroit. Passer GITHUB_SCOPE à `repo` si le dépôt redevient privé.
  authorize.searchParams.set('scope', env.GITHUB_SCOPE || 'public_repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // le state est relu au retour depuis ce cookie, jamais depuis l'URL seule
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
