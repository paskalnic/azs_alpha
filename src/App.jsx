import LandingPage from './components/LandingPage';
import { landingData } from './data/landingData';

export default function App() {
  // Pour tester l'autre mise en page :
  // <LandingPage data={{ ...landingData, disposition: 'full-screen' }} />
  return <LandingPage data={landingData} />;
}
