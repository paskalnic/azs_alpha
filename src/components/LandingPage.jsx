import Header from './Header';
import Hero from './Hero';
import ProofBar from './ProofBar';
import PromiseSection from './PromiseSection';
import Formations from './Formations';
import WhyBento from './WhyBento';
import Testimonial from './Testimonial';
import Financement from './Financement';
import FinalCta from './FinalCta';
import Footer from './Footer';
import MobileDock from './MobileDock';
import { landingData as defaultData } from '../data/landingData';

/**
 * Page complète. Tout le contenu vient de `data` ; `data.disposition`
 * ('split' | 'full-screen') pilote la mise en page du hero.
 * `disposition` en prop permet de surcharger ponctuellement la donnée.
 */
export default function LandingPage({ data = defaultData, disposition }) {
  const layout = disposition ?? data.disposition ?? 'split';

  return (
    <div className={`landing landing--${layout}`} data-disposition={layout}>
      <Header brand={data.brand} nav={data.nav} />

      <main id="top">
        <Hero hero={data.hero} disposition={layout} />
        <ProofBar proof={data.proof} />
        <PromiseSection promise={data.promise} />
        <Formations formations={data.formations} />
        <WhyBento why={data.why} />
        <Testimonial testimonial={data.testimonial} />
        <Financement financement={data.financement} />
        <FinalCta finalCta={data.finalCta} />
      </main>

      <Footer brand={data.brand} footer={data.footer} />
      <MobileDock dock={data.dock} />
    </div>
  );
}
