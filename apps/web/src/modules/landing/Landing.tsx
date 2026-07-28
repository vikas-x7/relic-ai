import Nav from '@/src/modules/landing/components/Nav';
import Build from '@/src/modules/landing/components/Build';
import Pricing from '@/src/modules/landing/components/Pricing';

import WhyAgentsSection from '@/src/modules/landing/components/WhyAgentsSection';
import Highlights from '@/src/modules/landing/components/Highlights';

import Feature from '@/src/modules/landing/components/Feature';
import Getstart from '@/src/modules/landing/components/Getstart';

import MovingHanding from '@/src/modules/landing/components/MovingHading';
import Herosection from '@/src/modules/landing/components/Herosection';
import Footer from '@/src/modules/landing/components/Footer';
import Faq from './components/Faq';

function Landing() {
  return (
    <>
      <div className="">
        <Nav />

        <Herosection />
        <Highlights />
        <div className=" relative font-cabin">
          <WhyAgentsSection />
          <MovingHanding />
          <Feature />
          <Build />
        </div>

        <Getstart />
        <Footer />
      </div>
    </>
  );
}

export default Landing;
