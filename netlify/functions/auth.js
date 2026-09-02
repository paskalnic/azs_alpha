/**
 * Démarrage de l'authentification GitHub.
 *
 * Redirige vers la page d'autorisation de GitHub. Le secret client ne quitte
 * jamais le serveur : seul l'identifiant public circule ici.
 *
 * Variables d'environnement attendues (Netlify → Site settings → Environment) :
 *   GITHUB_CLIENT_ID      identifiant de l'application OAuth
 *   GITHUB_CLIENT_SECRET  son secret (utilisé par callback.js uniquement)
 */
export default async (request) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Configuration incomplète : GITHUB_CLIENT_ID n'est pas défini.", {
      status: 500,
    });
  }

  const url = new URL(request.url);
  // jeton anti-rejeu, revérifié au retour
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${url.origin}/.netlify/functions/callback`);
  // `repo` est nécessaire pour écrire dans un dépôt privé ; `public_repo` suffit s'il est public
  authorize.searchParams.set('scope', process.env.GITHUB_SCOPE || 'repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      // le state est relu au retour depuis ce cookie, jamais depuis l'URL seule
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    },
  });
};
