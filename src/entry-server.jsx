import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { HeadProvider } from './seo/HeadProvider';

/**
 * Rend une route en HTML statique et récupère ses métadonnées.
 * Appelé par scripts/prerender.mjs, une fois par chemin.
 */
export function render(url) {
  const sink = {};
  const html = renderToString(
    <HeadProvider sink={sink}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadProvider>,
  );
  return { html, head: sink.head };
}

export { routes, prerenderPaths } from './routes';
export { renderHeadTags } from './seo/head';
export { SITE } from './site.config';
