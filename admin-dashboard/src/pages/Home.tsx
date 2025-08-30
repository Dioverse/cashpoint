import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import all the section components
import {
  Header,
  HeroSection,
  AboutSection,
  StatsSection,
  ServicesSection,
  StepsSection,
  TeamSection,
  FAQSection,
  TestimonialsSection,
  GallerySection,
  ContactSection,
  Footer,
} from '../components';

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <StepsSection />
        <TeamSection />
        <FAQSection />
        <TestimonialsSection />
        <GallerySection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
