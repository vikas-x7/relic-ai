import Hero from '@/src/modules/landing/components/Hero';
import Nav from '@/src/modules/landing/components/Nav';
import Build from '@/src/modules/landing/components/Build';
import MovingHanding from '@/src/modules/landing/components/MovingHading';
import WhyAgentsSection from '@/src/modules/landing/components/WhyAgentsSection';
import Highlights from '@/src/modules/landing/components/Highlights';
import Integrations from '@/src/modules/landing/components/Integrations';
import Feature from '@/src/modules/landing/components/Feature';
import Faq from '@/src/modules/landing/components/Faq';
import Getstart from '@/src/modules/landing/components/Getstart';
import Footer from '@/src/modules/landing/components/Footer';

function Landing() {
  return (
    <>
      <Nav />
      <Hero />
      <div className=" relative  bg-black  font-cabin">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
          <svg className="h-full w-full" id="noice-feature">
            <filter id="noise-filter-feature">
              <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="4" stitchTiles="stitch"></feTurbulence>
              <feColorMatrix type="saturate" values="0"></feColorMatrix>
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.37"></feFuncR>
                <feFuncG type="linear" slope="0.37"></feFuncG>
                <feFuncB type="linear" slope="0.37"></feFuncB>
                <feFuncA type="linear" slope="0.13"></feFuncA>
              </feComponentTransfer>
              <feComponentTransfer>
                <feFuncR type="linear" slope="0" intercept="0.50" />
                <feFuncG type="linear" slope="0" intercept="0.50" />
                <feFuncB type="linear" slope="0" intercept="0.50" />
              </feComponentTransfer>
            </filter>
            <rect width="100%" height="100%" filter="url(#noise-filter-feature)"></rect>
          </svg>
        </div>

        <WhyAgentsSection />
        <MovingHanding />
        <Feature />
        <Highlights />
        <Integrations />
        <Build />
      </div>

      <Faq />
      <Getstart />
      <Footer />
    </>
  );
}

export default Landing;
