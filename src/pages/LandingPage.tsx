import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import TrustBar from '../components/landing/TrustBar';
import Features from '../components/landing/Features';
import ProductShowcase from '../components/landing/ProductShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import LearnerSection from '../components/landing/LearnerSection';
import OrganisationSection from '../components/landing/OrganisationSection';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <ProductShowcase />
        <HowItWorks />
        <LearnerSection />
        <OrganisationSection />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
