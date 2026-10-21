/**
 * Connexion GitHub, côté navigateur.
 *
 * L'autorisation se déroule dans une fenêtre séparée ; le jeton revient par
 * postMessage et n'apparaît donc jamais dans l'URL. Il est conservé en
 * `sessionStorage` : il disparaît à la fermeture de l'onglet, ce qui limite
 * l'exposition sur un poste partagé.
 */

const KEY = 'azs-admin-token';

export const getToken = () => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const clearToken = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch { /* stockage indisponible */ }
};

export function login() {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      '/api/auth',
      'azs-admin-auth',
      'width=680,height=760,menubar=no,toolbar=no',
    );
    if (!popup) {
      reject(new Error("La fenêtre de connexion a été bloquée. Autorisez les fenêtres surgissantes."));
      return;
    }

    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.source !== 'azs-admin-auth') return;
      cleanup();
      const { token, error } = event.data.payload || {};
      if (error) {
        reject(new Error(error));
        return;
      }
      if (typeof token !== 'string' || !token) {
        reject(new Error('GitHub n’a renvoyé aucun jeton. Relancez la connexion.'));
        return;
      }
      try {
        sessionStorage.setItem(KEY, token);
      } catch { /* stockage indisponible : le jeton ne vivra que le temps de la session */ }
      resolve(token);
    };

    // si la fenêtre est fermée sans aller au bout, on ne laisse pas la promesse en suspens
    const timer = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('Connexion interrompue.'));
      }
    }, 500);

    function cleanup() {
      clearInterval(timer);
      window.removeEventListener('message', onMessage);
    }

    window.addEventListener('message', onMessage);
  });
}
