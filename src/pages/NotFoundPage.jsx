import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useHead } from '../seo/HeadProvider';
import { landingData } from '../data/landingData';

export default function NotFoundPage() {
  useHead({
    path: '/404/',
    title: 'Page introuvable',
    description: "Cette page n'existe pas ou a été déplacée.",
    noindex: true,
  });

  return (
    <div className="landing">
      <Header brand={landingData.brand} nav={landingData.nav} />
      <main id="top" className="sec">
        <div className="wrap">
          <span className="eyebrow">Erreur 404</span>
          <h1 style={{ maxWidth: '18ch', marginBlock: '1rem' }}>Cette page n'existe pas.</h1>
          <p className="lead" style={{ marginBottom: '2rem' }}>
            Le lien est peut-être erroné, ou la page a été déplacée.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            Retour à l'accueil
          </Link>
        </div>
      </main>
      <Footer brand={landingData.brand} footer={landingData.footer} />
    </div>
  );
}
