"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  CreditCard,
  HardDrive,
  Heart,
  Play,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  discount: number;
  image: string;
  category: string;
  brand: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge
                  variant="outline"
                  className="bg-black text-white border-black hover:bg-gray-800 transition-colors"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  New Collection 2025
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 leading-tight">
                  Future Tech
                  <span className="block text-5xl lg:text-6xl font-light text-gray-600">
                    Today
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                  Experience tomorrow&apos;s technology today with our premium
                  collection of cutting-edge electronics designed for the modern
                  lifestyle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black px-8 py-6 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Explore Collection
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 text-lg font-medium"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    50K+ Happy Customers
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    4.9/5 Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square">
                {/* Main Product Showcase */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-blue-50 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="text-9xl animate-bounce">🎧</div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg animate-float">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-4 shadow-lg animate-float animation-delay-2000">
                  <ShoppingCart className="w-6 h-6 text-green-500" />
                </div>
                <div className="absolute top-1/2 -left-8 bg-white rounded-full p-3 shadow-lg animate-float animation-delay-4000">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              Categories
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium electronics
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.id} className="group cursor-pointer">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 transform group-hover:rotate-6">
                      <div className="text-blue-600 group-hover:text-white transition-colors">
                        {category.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.count} items
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <Badge variant="outline" className="mb-4">
                <Star className="w-3 h-3 mr-2" />
                Featured
              </Badge>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Trending Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked for innovation and style
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden lg:flex items-center gap-2 rounded-full px-6 py-3 border-2 hover:bg-black hover:text-white transition-all duration-300"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isHovered={hoveredProduct === product.id}
                onHover={() => setHoveredProduct(product.id)}
                onLeave={() => setHoveredProduct(null)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Special Offer */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 items-center">
              <div className="p-12 lg:p-16">
                <Badge
                  variant="secondary"
                  className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm"
                >
                  <Clock className="w-3 h-3 mr-2" />
                  Limited Time
                </Badge>
                <h3 className="text-5xl font-bold mb-6 leading-tight">
                  Save 40% on
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Premium Audio
                  </span>
                </h3>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Experience exceptional sound quality with our curated audio
                  collection featuring the latest technology.
                </p>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-500 hover:to-orange-500 px-8 py-6 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Shop Audio
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="p-12 lg:p-16">
                <div className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <div className="text-9xl animate-pulse">🎵</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Premium Experience
            </h2>
            <p className="text-xl text-gray-600">
              Commitment to excellence in every detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                  <div className="text-blue-600 group-hover:text-white transition-colors">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter */}
      <section className="py-24 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Badge
              variant="secondary"
              className="mb-4 bg-white/10 text-white border-white/20"
            >
              <Sparkles className="w-3 h-3 mr-2" />
              Newsletter
            </Badge>
            <h2 className="text-5xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-xl text-gray-300">
              Get exclusive access to new products, special offers, and tech
              insights
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:border-white/40 text-white placeholder-gray-300 backdrop-blur-sm"
            />
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  product,
  isHovered,
  onHover,
  onLeave,
}: {
  product: Product;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
          <div
            className={`text-7xl transition-all duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          >
            {getProductEmoji(product.category)}
          </div>
          {product.discount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg"
            >
              -{product.discount}%
            </Badge>
          )}
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
              {product.brand}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 font-medium">
                {product.rating}
              </span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-full py-3 transform hover:scale-105 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

function getProductEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    Audio: "🎧",
    Chargers: "🔌",
    Storage: "💾",
    Accessories: "📱",
  };
  return emojiMap[category] || "📦";
}

// Sample data
const stats = [
  { value: "50K+", label: "Customers" },
  { value: "4.9", label: "Rating" },
  { value: "1000+", label: "Products" },
  { value: "24/7", label: "Support" },
];

const categories = [
  {
    id: 1,
    name: "Audio",
    slug: "audio",
    count: 150,
    icon: <Volume2 className="w-6 h-6" />,
  },
  {
    id: 2,
    name: "Chargers",
    slug: "chargers",
    count: 200,
    icon: <Zap className="w-6 h-6" />,
  },
  {
    id: 3,
    name: "Storage",
    slug: "storage",
    count: 100,
    icon: <HardDrive className="w-6 h-6" />,
  },
  {
    id: 4,
    name: "Accessories",
    slug: "accessories",
    count: 300,
    icon: <Smartphone className="w-6 h-6" />,
  },
];

const benefits = [
  {
    title: "Lightning Fast Delivery",
    description:
      "Free express shipping on orders over $50 with same-day delivery available in select cities.",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    title: "2-Year Warranty",
    description:
      "Comprehensive warranty coverage with 24/7 customer support and free repairs.",
    icon: <Shield className="w-8 h-8" />,
  },
  {
    title: "Secure Payments",
    description:
      "Bank-level encryption with multiple payment options and fraud protection guarantee.",
    icon: <CreditCard className="w-8 h-8" />,
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headset",
    description:
      "Immersive sound quality with noise cancellation for an exceptional audio experience",
    price: 129.99,
    oldPrice: 179.99,
    rating: 4.8,
    discount: 27,
    image: "/images/headset-1.jpg",
    category: "Audio",
    brand: "SonicWave",
  },
  {
    id: 2,
    name: "Fast Charging Power Bank",
    description:
      "20000mAh high-capacity power bank with fast charging technology",
    price: 49.99,
    oldPrice: 69.99,
    rating: 4.9,
    discount: 28,
    image: "/images/powerbank-1.jpg",
    category: "Chargers",
    brand: "PowerMax",
  },
  {
    id: 3,
    name: "Bluetooth Wireless Earbuds",
    description:
      "True wireless earbuds with touch controls and long battery life",
    price: 89.99,
    oldPrice: null,
    rating: 4.7,
    discount: 0,
    image: "/images/earbuds-1.jpg",
    category: "Audio",
    brand: "AudioPro",
  },
  {
    id: 4,
    name: "High-Speed USB 3.0 Drive",
    description: "Ultra-fast data transfer with 128GB storage capacity",
    price: 29.99,
    oldPrice: 39.99,
    rating: 4.6,
    discount: 25,
    image: "/images/usb-1.jpg",
    category: "Storage",
    brand: "DataFlash",
  },
];
