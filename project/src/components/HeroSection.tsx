import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

// ...existing code...
import Hero3D from './Hero3D';

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(titleRef.current, 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(subtitleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    )
    .fromTo(buttonRef.current ? Array.from(buttonRef.current.children) : [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
      "-=0.5"
    );
  }, []);

  const navigate = useNavigate();

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-60">
        <Hero3D />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
            Luxury
          </span>
          <br />
          Redefined
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Experience the future of premium shopping with our curated collection of extraordinary products
        </p>

        <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => {
              navigate('/products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
          >
            Explore Collection
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:scale-105 flex items-center gap-2">
            <Play size={20} className="group-hover:scale-110 transition-transform duration-300" />
            Watch Story
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}