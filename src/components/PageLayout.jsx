import Header from './Header';
import Footer from './Footer';
import MobileDock from './MobileDock';
import { landingData } from '../data/landingData';

/** Ossature commune à toutes les pages : en-tête, contenu, pied de page, barre mobile. */
export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`landing ${className}`.trim()}>
      <Header brand={landingData.brand} nav={landingData.nav} />
      <main id="top">{children}</main>
      <Footer brand={landingData.brand} footer={landingData.footer} />
      <MobileDock dock={landingData.dock} />
    </div>
  );
}
