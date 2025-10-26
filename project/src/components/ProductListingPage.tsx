import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sliders, ChevronDown, X, Search, ArrowUpDown, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductCard from './ProductCard';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Filter options
const brands = ['Luxe Elite', 'Timeless', 'Avant-Garde', 'Elegance', 'Pure Luxury'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Rose Gold', hex: '#B76E79' },
  { name: 'Navy', hex: '#000080' },
];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'newest';

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  sizes: string[];
}

// Use the same products as in ProductShowcase/ProductCard
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: "$299",
    numericPrice: 299,
    originalPrice: "$399",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    isSale: true,
    brand: "Luxe Elite",
    color: "Black",
    size: "M",
    date: "2025-10-01"
  },
  {
    id: 2,
    name: "Luxury Smartwatch",
    price: "$599",
    numericPrice: 599,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    brand: "Pure Luxury",
    color: "Gold",
    size: "M",
    date: "2025-10-15"
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    price: "$249",
    numericPrice: 249,
    originalPrice: "$320",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500",
    isSale: true,
    brand: "Avant-Garde",
    color: "Black",
    size: "M",
    date: "2025-09-20"
  },
  {
    id: 4,
    name: "Premium Leather Bag",
    price: "$450",
    numericPrice: 450,
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500",
    brand: "Timeless",
    color: "Navy",
    size: "L",
    date: "2025-08-30"
  },
  {
    id: 5,
    name: "Minimalist Phone Case",
    price: "$89",
    numericPrice: 89,
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    brand: "Elegance",
    color: "Silver",
    size: "M",
    date: "2025-10-10"
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: "$129",
    numericPrice: 129,
    originalPrice: "$160",
    image: "https://images.pexels.com/photos/4246153/pexels-photo-4246153.jpeg?auto=compress&cs=tinysrgb&w=500",
    isSale: true,
    brand: "Luxe Elite",
    color: "Black",
    size: "M",
    date: "2025-09-15"
  }
];

const ProductListingPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    colors: [],
    sizes: []
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    const ctx = gsap.context(() => {
      gsap.fromTo(".filter-section",
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(".product-card",
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Apply filters
    if (activeFilters.brands.length) {
      result = result.filter(p => activeFilters.brands.includes(p.brand));
    }
    if (activeFilters.colors.length) {
      result = result.filter(p => activeFilters.colors.includes(p.color));
    }
    if (activeFilters.sizes.length) {
      result = result.filter(p => activeFilters.sizes.includes(p.size));
    }
    result = result.filter(p => 
      p.numericPrice >= activeFilters.priceRange[0] && 
      p.numericPrice <= activeFilters.priceRange[1]
    );

    // Apply sorting
    switch(sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      default:
        // Default to popularity (no sort needed as products are pre-sorted)
        break;
    }

    // Animate the transition of products
    const ctx = gsap.context(() => {
      gsap.fromTo(".product-card",
        { scale: 0.95, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    });

    setFilteredProducts(result);
    return () => ctx.revert();
  }, [activeFilters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Navigation />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="text-white/80 text-sm mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={16} />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={16} />
          <span className="text-white font-medium">All Products</span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-12">Luxury Collection</h1>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div 
            ref={filtersRef}
            className={`filter-section bg-white/10 backdrop-blur-md rounded-2xl p-6 w-64 flex-shrink-0 transition-all duration-300 
              ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              fixed lg:relative left-0 top-0 h-full lg:h-auto z-40`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-white/90 font-medium mb-4">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="1000"
                step="10"
                value={activeFilters.priceRange[1]}
                onChange={(e) => setActiveFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                }))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-white/80 text-sm mt-2">
                <span>${activeFilters.priceRange[0]}</span>
                <span>${activeFilters.priceRange[1]}</span>
              </div>
            </div>

            {/* Brands */}
            <div className="mb-8">
              <h3 className="text-white/90 font-medium mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 text-white/80 hover:text-white cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={activeFilters.brands.includes(brand)}
                      onChange={() => {
                        setActiveFilters(prev => ({
                          ...prev,
                          brands: prev.brands.includes(brand)
                            ? prev.brands.filter(b => b !== brand)
                            : [...prev.brands, brand]
                        }));
                      }}
                      className="accent-orange-500"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h3 className="text-white/90 font-medium mb-4">Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setActiveFilters(prev => ({
                        ...prev,
                        colors: prev.colors.includes(color.name)
                          ? prev.colors.filter(c => c !== color.name)
                          : [...prev.colors, color.name]
                      }));
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      activeFilters.colors.includes(color.name)
                        ? 'border-orange-500 scale-110'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <h3 className="text-white/90 font-medium mb-4">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setActiveFilters(prev => ({
                        ...prev,
                        sizes: prev.sizes.includes(size)
                          ? prev.sizes.filter(s => s !== size)
                          : [...prev.sizes, size]
                      }));
                    }}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeFilters.sizes.includes(size)
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 text-white/80 hover:text-white"
              >
                <Sliders size={20} />
                Filters
              </button>

              <div className="flex items-center gap-4">
                <p className="text-white/80">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                </p>

                <div className="relative group">
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all">
                    <ArrowUpDown size={16} />
                    Sort by: {sortBy.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                    {(['popularity', 'price-asc', 'price-desc', 'newest'] as SortOption[]).map(option => (
                      <button
                        key={option}
                        onClick={() => setSortBy(option)}
                        className={`w-full text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all ${
                          sortBy === option ? 'bg-white/10 text-white' : ''
                        }`}
                      >
                        {option.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div 
              ref={gridRef} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3].map(page => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-full transition-all ${
                    page === 1
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all">
                →
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductListingPage;
