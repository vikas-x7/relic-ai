import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Feature from './components/Feature'
import Faq from './components/Faq'
import Getstart from './components/Getstart'
import Footer from './components/Footer'

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Feature />
      <Faq />
      <Getstart />
      <Footer />
    </>
  )
}

export default Landing