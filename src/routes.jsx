import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import FormationPage from './pages/FormationPage';
import CategoryPage from './pages/CategoryPage';
import CatalogPage from './pages/CatalogPage';
import QualityPage from './pages/QualityPage';
import ResultsPage from './pages/ResultsPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import { FORMATIONS, CATEGORIES } from './data/formations';
import { LEGAL_PAGES } from './data/legalPages';

/**
 * Table de routage — source de vérité unique, lue par le routeur,
 * le pré-rendu statique et le générateur de sitemap.
 *
 * Les chemins reprennent exactement les URL du site WordPress : le domaine
 * étant conservé, le positionnement acquis sur ces adresses est préservé.
 * Une seule adresse n'a pas d'équivalent, /inscription-formation/, et elle
 * est redirigée en 301 vers /contact/ dans public/_redirects.
 *
 * `sitemap` dit seulement si la page est annoncée aux moteurs. Il ne porte
 * ni `priority` ni `changefreq` : Google ignore les deux, et les écrire
 * laissait croire qu'on réglait quelque chose.
 */
const CATALOG_PATH = '/nos-formations/';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    sitemap: true,
  },

  {
    path: CATALOG_PATH,
    element: <CatalogPage path={CATALOG_PATH} title="Nos formations" />,
    sitemap: true,
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
    sitemap: true,
  })),

  {
    path: '/nos-engagements-qualite/',
    element: <QualityPage />,
    sitemap: true,
  },
  {
    path: '/nos-resultats/',
    element: <ResultsPage />,
    sitemap: true,
  },
  {
    path: '/contact/',
    element: <ContactPage />,
    sitemap: true,
  },

  ...FORMATIONS.map((formation) => ({
    path: formation.path,
    element: <FormationPage formation={formation} />,
    sitemap: true,
  })),

  ...LEGAL_PAGES.map((page) => ({
    path: page.path,
    element: <LegalPage page={page} />,
    /* Indexables : ces mentions doivent rester accessibles. Aucune valeur du
       sitemap ne peut dire qu'elles comptent moins que les formations — c'est
       le maillage interne et leur contenu qui le disent à Google. */
    sitemap: true,
  })),

  { path: '*', element: <NotFoundPage />, sitemap: false },
];

/** Chemins à pré-rendre : toutes les routes réelles, y compris hors sitemap. */
export const prerenderPaths = () => routes.filter((r) => r.path !== '*').map((r) => r.path);

export default routes;
