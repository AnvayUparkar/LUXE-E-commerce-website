import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  ChevronRight, 
  Star, 
  StarHalf, 
  Plus, 
  Minus, 
  ShoppingBag,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductCard from './ProductCard';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mock product data (you can replace this with your API call)
const productData = {
  id: 1,
  name: "Luxury Smartwatch Pro",
  description: "Experience the perfect blend of technology and luxury with our premium smartwatch. Featuring a sapphire crystal display and premium materials.",
  price: 599,
  originalPrice: 799,
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  images: [
    "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/437039/pexels-photo-437039.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/437040/pexels-photo-437040.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ],
  colors: [
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Space Black", hex: "#000000" },
    { name: "Rose Gold", hex: "#B76E79" }
  ],
  sizes: ["38mm", "42mm", "45mm"],
  specs: [
    { label: "Display", value: "1.78″ AMOLED" },
    { label: "Battery Life", value: "Up to 18 hours" },
    { label: "Water Resistance", value: "50 meters" },
    { label: "Connectivity", value: "Bluetooth 5.0, Wi-Fi" },
    { label: "Sensors", value: "Heart rate, ECG, Blood oxygen" }
  ],
  reviews: [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2025-10-15",
      comment: "Absolutely stunning timepiece! The build quality is exceptional."
    },
    {
      id: 2,
      user: "James R.",
      rating: 4,
      date: "2025-10-10",
      comment: "Great features and beautiful design. Battery life could be better."
    }
  ]
};

// Mock related products
const relatedProducts = [
  {
    id: 2,
    name: "Premium Wireless Headphones",
    price: "$299",
    numericPrice: 299,
    originalPrice: "$399",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    isSale: true
  },
  // Add more related products...
];

type TabType = 'description' | 'specifications' | 'reviews';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState(productData.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const mainImageRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial animations
    const ctx = gsap.context(() => {
      // Fade in main image and details
      gsap.fromTo(mainImageRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(detailsRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );

      // Scroll animations
      gsap.fromTo(tabsRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 80%"
          }
        }
      );

      gsap.fromTo(relatedRef.current,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: relatedRef.current,
            start: "top 80%"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    const button = document.querySelector('.add-to-cart-btn');
    if (!button) return;

    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Show toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
    toast.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>Added to Cart';
    document.body.appendChild(toast);

    gsap.fromTo(toast,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    setTimeout(() => {
      gsap.to(toast, {
        y: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => toast.remove()
      });
    }, 2000);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-yellow-400 fill-yellow-400" size={20} />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" size={20} />);
    }

    return stars;
  };

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
          <span className="text-white font-medium">{productData.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div ref={mainImageRef}>
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden mb-4">
              <img 
                src={productData.images[activeImage]}
                alt={productData.name}
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    index === activeImage 
                      ? 'ring-2 ring-orange-500' 
                      : 'ring-1 ring-white/20 hover:ring-white/40'
                  }`}
                >
                  <img 
                    src={image}
                    alt={`${productData.name} view ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div ref={detailsRef} className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{productData.name}</h1>
                <p className="text-white/80 mb-4">{productData.description}</p>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Heart 
                  size={24} 
                  className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'} 
                />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {renderStars(productData.rating)}
              </div>
              <span className="text-white/80">({productData.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-white">${productData.price}</span>
              {productData.originalPrice && (
                <span className="text-xl text-white/60 line-through">
                  ${productData.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6
              ${productData.inStock 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
              }`}
            >
              {productData.inStock ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-white/90 font-medium mb-3">Color</h3>
              <div className="flex gap-3">
                {productData.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedColor.name === color.name
                        ? 'ring-2 ring-orange-500 scale-110'
                        : 'ring-1 ring-white/20 hover:ring-white/40'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-white/90 font-medium mb-3">Size</h3>
              <div className="flex gap-3">
                {productData.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedSize === size
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-white/90 font-medium">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 rounded-l-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="w-16 text-center py-2 bg-white/10 text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 rounded-r-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="flex-1 border-2 border-white/20 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div ref={tabsRef} className="mb-16">
          <div className="flex border-b border-white/20">
            {(['description', 'specifications', 'reviews'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-lg font-medium transition-colors relative
                  ${activeTab === tab 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white/80'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80">
                  {productData.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productData.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-white/60">{spec.label}</span>
                    <span className="text-white font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {productData.reviews.map(review => (
                  <div key={review.id} className="bg-white/5 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{review.user}</span>
                      <span className="text-white/60">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-white/80">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div ref={relatedRef}>
          <h2 className="text-2xl font-bold text-white mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;