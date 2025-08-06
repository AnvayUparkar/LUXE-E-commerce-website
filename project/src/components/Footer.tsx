import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">LUXE</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Redefining luxury shopping with carefully curated products that inspire and elevate your lifestyle.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-orange-500 transition-all duration-300 hover:scale-110"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Contact', 'Careers', 'Press'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {['Help Center', 'Shipping Info', 'Returns', 'Size Guide'].map((support) => (
                <li key={support}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    {support}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 LUXE. All rights reserved. Made with ❤️ for exceptional experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}