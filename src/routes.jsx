import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import FormationPage from './pages/FormationPage';
import CategoryPage from './pages/CategoryPage';
import CatalogPage from './pages/CatalogPage';
import QualityPage from './pages/QualityPage';
import ResultsPage from './pages/ResultsPage';
import ContactPage from './pages/ContactPage';
import { FORMATIONS, CATEGORIES } from './data/formations';

/**
 * Table de routage — source de vérité unique, lue par le routeur,
 * le pré-rendu statique et le générateur de sitemap.
 *
 * Les chemins reprennent exactement les URL du site WordPress : le domaine
 * étant conservé, le positionnement acquis sur ces adresses est préservé
 * et aucune redirection n'est nécessaire.
 */
const CATALOG_PATH = '/nos-formations/';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    sitemap: { priority: 1.0, changefreq: 'monthly' },
  },

  {
    path: CATALOG_PATH,
    element: <CatalogPage path={CATALOG_PATH} title="Nos formations" />,
    sitemap: { priority: 0.9, changefreq: 'monthly' },
  },
  {
    /* URL historique conservée, mais canonique pointée vers /nos-formations/
       pour ne pas dupliquer le même contenu sur deux adresses. */
    path: '/nos-prestations/',
    element: (
      <CatalogPage path="/nos-prestations/" canonicalPath={CATALOG_PATH} title="Nos prestations" />
    ),
    sitemap: false,
  },

  ...CATEGORIES.map((category) => ({
    path: category.path,
    element: <CategoryPage category={category} />,
    sitemap: { priority: 0.8, changefreq: 'monthly' },
  })),

  {
    path: '/nos-engagements-qualite/',
    element: <QualityPage />,
    sitemap: { priority: 0.7, changefreq: 'yearly' },
  },
  {
    path: '/nos-resultats/',
    element: <ResultsPage />,
    sitemap: { priority: 0.6, changefreq: 'yearly' },
  },
  {
    path: '/contact/',
    element: <ContactPage />,
    sitemap: { priority: 0.9, changefreq: 'yearly' },
  },

  ...FORMATIONS.map((formation) => ({
    path: formation.path,
    element: <FormationPage formation={formation} />,
    sitemap: { priority: 0.7, changefreq: 'yearly' },
  })),

  { path: '*', element: <NotFoundPage />, sitemap: false },
];

/** Chemins à pré-rendre : toutes les routes réelles, y compris hors sitemap. */
export const prerenderPaths = () => routes.filter((r) => r.path !== '*').map((r) => r.path);

export default routes;
