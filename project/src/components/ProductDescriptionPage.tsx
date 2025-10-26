import React, { useEffect, useRef } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { gsap } from 'gsap';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';

// Use the same products data as in ProductShowcase
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: "$299",
    originalPrice: "$399",
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    isSale: true,
    description: "Experience premium sound quality with our latest wireless headphones. Featuring active noise cancellation, long battery life, and premium materials for ultimate comfort.",
    specifications: "Active Noise Cancellation • 30-hour battery life • Bluetooth 5.0 • Premium leather cushions • Touch controls",
    brand: "AudioLuxe",
    color: "Space Gray",
    size: "One Size"
  },
  {
    id: 2,
    name: "Luxury Smartwatch",
    price: "$599",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    description: "Stay connected in style with our premium smartwatch. Features a vibrant display, health monitoring, and premium build quality.",
    specifications: "AMOLED Display • Heart Rate Monitor • GPS • 5 ATM Water Resistance • 3-day battery life",
    brand: "TechElite",
    color: "Silver",
    size: "44mm"
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    price: "$249",
    originalPrice: "$320",
    image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500",
    isSale: true,
    description: "Make a statement with our designer sunglasses. Crafted with premium materials and offering superior UV protection.",
    specifications: "UV400 Protection • Polarized Lenses • Italian Acetate Frame • Spring Hinges",
    brand: "VisionLuxe",
    color: "Tortoise Shell",
    size: "Medium"
  },
  {
    id: 4,
    name: "Premium Leather Bag",
    price: "$450",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Elevate your style with our premium leather bag. Handcrafted from full-grain leather with ample storage.",
    specifications: "Full-grain leather • Brass hardware • Multiple compartments • Adjustable strap",
    brand: "LeatherCraft",
    color: "Cognac",
    size: "Large"
  },
  {
    id: 5,
    name: "Minimalist Phone Case",
    price: "$89",
    image: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=500",
    isNew: true,
    description: "Protect your device with style using our minimalist phone case. Premium materials and sleek design.",
    specifications: "Premium silicone • Microfiber lining • Wireless charging compatible • Drop protection",
    brand: "TechStyle",
    color: "Midnight Blue",
    size: "iPhone 13 Pro"
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: "$129",
    originalPrice: "$160",
    image: "https://images.pexels.com/photos/4246153/pexels-photo-4246153.jpeg?auto=compress&cs=tinysrgb&w=500",
    isSale: true,
    description: "Experience seamless charging with our premium wireless charging pad. Fast charging capabilities in a sleek design.",
    specifications: "15W Fast Charging • Multi-device support • LED indicators • Premium aluminum build",
    brand: "PowerLuxe",
    color: "Space Gray",
    size: "Standard"
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id)) || products[0];
  
  const mainRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animations
      gsap.fromTo(mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // Product image animation
      gsap.fromTo(imageRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
      );

      // Product info animation
      gsap.fromTo(infoRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
      );

      // Related products animation
      if (relatedRef.current) {
        gsap.fromTo(relatedRef.current.querySelectorAll('.product-card'),
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: relatedRef.current,
              start: "top 80%"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main ref={mainRef} className="flex-1 max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8 text-gray-500">
          Home &gt; Products &gt; <span className="text-gray-900 font-semibold">{product.name}</span>
        </nav>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="flex-1">
            <img 
              ref={imageRef}
              src={product.image} 
              alt={product.name} 
              className="w-full h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105" 
            />
          </div>
          {/* Product Info */}
          <div ref={infoRef} className="flex-1 flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  NEW
                </span>
              )}
              {product.isSale && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  SALE
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                <p className="text-gray-600">{product.specifications}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500">Brand</h3>
                  <p className="text-gray-900">{product.brand}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Color</h3>
                  <p className="text-gray-900">{product.color}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Size</h3>
                  <p className="text-gray-900">{product.size}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105">
                  Add to Cart
                </button>
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div ref={relatedRef} className="mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.id !== product.id).slice(0, 3).map(rp => (
              <div key={rp.id} className="product-card">
                <ProductCard {...rp} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
