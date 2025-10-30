import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

import AuthForm from './AuthForm';
import { UserContext } from '../UserContext';

export default function Navigation() {
  // user context is used in ProfileMenu only
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      '.nav-item',
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="nav-item flex-shrink-0 cursor-pointer" 
            onClick={() => navigate('/')}>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-900 hover:text-orange-500' : 'text-white hover:text-orange-300'
            }`}>
              LUXE
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Shop', 'Collections', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`nav-item px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-orange-500' 
                      : 'text-white/90 hover:text-orange-300'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className={`nav-item p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
                isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white'
              }`}
              onClick={() => setShowAuthForm(true)}
            >
              <Search size={20} />
            </button>
            {/* User/Profile Dropdown */}
            <ProfileMenu isScrolled={isScrolled} setShowAuthForm={setShowAuthForm} />
            <button
              className={`nav-item p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
                isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white'
              }`}
            >
              <ShoppingBag size={20} />
            </button>

            {/* Auth Form Modal */}
            {showAuthForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg mx-4">
                  <button
                    onClick={() => setShowAuthForm(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <AuthForm closeModal={() => setShowAuthForm(false)} />
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 p-4 shadow-lg">
            <div className="space-y-2">
              {['Shop', 'Collections', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ProfileMenu component for user dropdown
import { Fragment, useState as useReactState, useContext as useReactContext } from 'react';
import type { User as UserType } from '../UserContext';
function ProfileMenu({ isScrolled, setShowAuthForm }: { isScrolled: boolean, setShowAuthForm: (v: boolean) => void }) {
  const { user, logout } = useReactContext(UserContext) as { user: UserType | null, logout: () => void };
  const [open, setOpen] = useReactState(false);

  if (!user) {
    return (
      <button
        className={`nav-item p-2 rounded-full transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
          isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white'
        }`}
        onClick={() => setShowAuthForm(true)}
      >
        <User size={20} />
      </button>
    );
  }
  return (
    <Fragment>
      <div className="relative">
        <button
          className={`nav-item p-2 rounded-full border-2 ${open ? 'border-orange-500' : 'border-transparent'} transition-all duration-300 hover:scale-110 hover:bg-white/10 ${
            isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white'
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          <User size={20} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2 text-gray-700 font-semibold border-b">{user.username}</div>
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => {/* go to profile */}}>
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}