import Header from '../components/Header';
import Hero from '../components/Hero';
import ProofBar from '../components/ProofBar';
import PromiseSection from '../components/PromiseSection';
import Formations from '../components/Formations';
import WhyBento from '../components/WhyBento';
import Testimonial from '../components/Testimonial';
import Financement from '../components/Financement';
import FinalCta from '../components/FinalCta';
import Footer from '../components/Footer';
import MobileDock from '../components/MobileDock';
import { landingData as defaultData } from '../data/landingData';
import { useHead } from '../seo/HeadProvider';
import { organizationLd } from '../seo/jsonld';
import { SITE } from '../site.config';

/**
 * Page complète. Tout le contenu vient de `data` ; `data.disposition`
 * ('split' | 'full-screen') pilote la mise en page du hero.
 * `disposition` en prop permet de surcharger ponctuellement la donnée.
 */
export default function HomePage({ data = defaultData, disposition }) {
  const layout = disposition ?? data.disposition ?? 'split';

  useHead({
    path: '/',
    title: SITE.name,
    description: SITE.description,
    jsonLd: organizationLd(),
  });

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
