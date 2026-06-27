import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import About from '@/components/landing/About'
import Approach from '@/components/landing/Approach'
import Services from '@/components/landing/Services'
import Testimonials from '@/components/landing/Testimonials'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Approach />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
