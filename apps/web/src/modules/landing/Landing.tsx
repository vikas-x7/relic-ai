import Feature from './components/Feature';
import Faq from './components/Faq';
import Getstart from './components/Getstart';
import Footer from './components/Footer';
import Hero from '@/src/modules/landing/components/Hero';
import Nav from '@/src/modules/landing/components/Nav';

function Landing() {
  return (
    <>
      <Nav />
      <Hero />
      <Feature />
      <Faq />
      <Getstart />
      <Footer />
    </>
  );
}

export default Landing;
