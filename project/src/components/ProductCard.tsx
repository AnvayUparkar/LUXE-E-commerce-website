import React, { useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  title?: string; // for compatibility with mock data
  name?: string;  // for compatibility with other data
  price: number | string;
  originalPrice?: number | string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
}

export default function ProductCard({ 
  id, 
  title, 
  name, 
  price, 
  originalPrice, 
  image, 
  isNew = false, 
  isSale = false 
}: ProductCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    const overlay = overlayRef.current;

    if (!card || !img || !overlay) return;

    const handleMouseEnter = () => {
      gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      gsap.to(img, { scale: 1.1, duration: 0.5, ease: "power2.out" });
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        {isNew && (
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            NEW
          </span>
        )}
        {isSale && (
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            SALE
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 hover:scale-110">
        <Heart size={18} className="text-gray-600 hover:text-red-500 transition-colors duration-300" />
      </button>

      {/* Image container */}
      <div className="relative h-64 overflow-hidden">
        <img
          ref={imageRef}
          src={image}
          alt={title || name || ''}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        {/* Overlay with actions */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 transition-opacity duration-300"
        >
          <button
            className="p-3 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            onClick={() => {
              navigate(`/product/${id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Eye size={20} className="text-gray-800" />
          </button>
          <button className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 hover:scale-110">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title || name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}