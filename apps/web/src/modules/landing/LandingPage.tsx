import Build from '@/src/modules/landing/components/Build';
import WhyAgentsSection from '@/src/modules/landing/components/WhyAgentsSection';
import Highlights from '@/src/modules/landing/components/Highlights';
import Feature from '@/src/modules/landing/components/Feature';
import Getstart from '@/src/modules/landing/components/Getstart';
import MovingHanding from '@/src/modules/landing/components/MovingHading';
import Herosection from '@/src/modules/landing/components/Herosection';
import Footer from '@/src/modules/landing/components/Footer';
import Faq from './components/Faq';
import NavBar from '@/src/modules/landing/components/NavBar';

function Landing() {
  return (
    <div className="w-full bg-white text-black min-h-screen relative overflow-x-clip">
      <div className="max-w-[1640px] mx-auto w-full relative font-cabin">
        <NavBar />
        <Herosection />
        <Highlights />
        <WhyAgentsSection />
        <MovingHanding />
        <Feature />
        <Build />
        <Faq />
        <Getstart />
        <Footer />
      </div>
    </div>
  );
}

export default Landing;
