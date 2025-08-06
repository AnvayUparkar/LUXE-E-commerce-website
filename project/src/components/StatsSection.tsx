import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "1000+", label: "Premium Products" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" }
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stat cards
      gsap.fromTo(".stat-card", 
        { y: 60, opacity: 0, scale: 0.8 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
          }
        }
      );

      // Animate numbers
      stats.forEach((stat, index) => {
        const element = document.querySelector(`.stat-value-${index}`);
        if (element) {
          gsap.fromTo(element,
            { innerText: 0 },
            {
              innerText: parseInt(stat.value.replace(/\D/g, '')),
              duration: 2,
              ease: "power2.out",
              snap: { innerText: 1 },
              scrollTrigger: {
                trigger: element,
                start: "top 80%",
              },
              onUpdate: function() {
                const value = Math.round(this.targets()[0].innerText);
                if (stat.value.includes('K')) {
                  element.textContent = value + 'K+';
                } else if (stat.value.includes('%')) {
                  element.textContent = value + '%';
                } else if (stat.value.includes('/')) {
                  element.textContent = '24/7';
                } else {
                  element.textContent = value + '+';
                }
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className={`text-4xl sm:text-5xl font-bold text-white mb-2 stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}