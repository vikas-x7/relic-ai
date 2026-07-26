import Nav from '@/src/modules/landing/components/Nav';
import Build from '@/src/modules/landing/components/Build';

import WhyAgentsSection from '@/src/modules/landing/components/WhyAgentsSection';
import Highlights from '@/src/modules/landing/components/Highlights';

import Feature from '@/src/modules/landing/components/Feature';
import Faq from '@/src/modules/landing/components/Faq';
import Getstart from '@/src/modules/landing/components/Getstart';

import MovingHanding from '@/src/modules/landing/components/MovingHading';
import Herosection from '@/src/modules/landing/components/Herosection';
import Footer from '@/src/modules/landing/components/Footer';

function Landing() {
  return (
    <>
      <div className="px-10 ">
        <Nav />

        <Herosection />
        <Highlights />
        <div className=" relative   font-cabin">
          <WhyAgentsSection />
          <MovingHanding />
          <Feature />

          <Build />
        </div>

        <Faq />
        <Getstart />
        <Footer />
      </div>
    </>
  );
}

export default Landing;
