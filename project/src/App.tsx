import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import ProductShowcase from './components/ProductShowcase';
import StatsSection from './components/StatsSection';
import NewsletterSection from './components/NewsletterSection';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize smooth scrolling
    gsap.registerPlugin(ScrollTrigger);
    
    // Page load animation
    gsap.set("body", { overflow: "hidden" });
    gsap.to("body", { overflow: "auto", delay: 0.5 });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <Features />
      <ProductShowcase />
      <StatsSection />
      <NewsletterSection />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default App;