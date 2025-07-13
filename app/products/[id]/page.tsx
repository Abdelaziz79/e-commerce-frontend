import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  discount: number;
  images: string[];
  category: string;
  brand: string;
  specs?: {
    [key: string]: string;
  };
  features?: string[];
  variants?: {
    color?: string[];
    size?: string[];
  };
  stock: number;
  reviews?: {
    id: number;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

// Sample data
const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headset",
    description:
      "Immersive sound quality with noise cancellation for an exceptional audio experience. Features long battery life, comfortable ear cushions, and adjustable headband for all-day wear.",
    price: 129.99,
    oldPrice: 179.99,
    rating: 4,
    discount: 27,
    images: [
      "/images/headset-1.jpg",
      "/images/headset-2.jpg",
      "/images/headset-3.jpg",
    ],
    category: "Audio",
    brand: "SonicWave",
    specs: {
      Connectivity: "Bluetooth 5.2",
      "Battery Life": "Up to 30 hours",
      "Driver Size": "40mm",
      "Frequency Response": "20Hz-20kHz",
      Impedance: "32 ohms",
      "Noise Cancellation": "Active Noise Cancellation (ANC)",
      Microphone: "Dual beamforming mics",
      Weight: "250g",
      Charging: "USB-C",
      Controls: "Touch & Voice",
    },
    features: [
      "Premium sound quality with deep bass and clear highs",
      "Active Noise Cancellation for immersive experience",
      "30-hour battery life on a single charge",
      "Fast charging - 10 minutes for 3 hours of playback",
      "Comfortable memory foam ear cushions",
      "Built-in voice assistant support",
      "Multipoint connection for seamless device switching",
    ],
    variants: {
      color: ["Black", "White", "Blue"],
    },
    stock: 45,
    reviews: [
      {
        id: 1,
        user: "AudioEnthusiast",
        rating: 5,
        comment:
          "Absolutely amazing sound quality! The noise cancellation is top-notch and battery life is impressive.",
        date: "2023-06-15",
      },
      {
        id: 2,
        user: "MusicLover22",
        rating: 4,
        comment:
          "Great headphones for the price. Comfortable for long listening sessions, though they get a bit warm after a few hours.",
        date: "2023-07-02",
      },
      {
        id: 3,
        user: "TechReviewer",
        rating: 4,
        comment:
          "Sound signature is excellent. Build quality is good but could be more premium for the price point.",
        date: "2023-08-11",
      },
    ],
  },
  {
    id: 2,
    name: "Fast Charging Power Bank",
    description:
      "High-capacity 20000mAh power bank with fast charging technology. Powers multiple devices simultaneously and includes smart power management.",
    price: 49.99,
    oldPrice: 69.99,
    rating: 5,
    discount: 28,
    images: [
      "/images/powerbank-1.jpg",
      "/images/powerbank-2.jpg",
      "/images/powerbank-3.jpg",
    ],
    category: "Chargers",
    brand: "PowerMax",
    specs: {
      Capacity: "20000mAh",
      Input: "USB-C (PD 3.0), Micro USB",
      Output: "USB-C (PD 20W), 2x USB-A (QC 3.0)",
      "Max Output": "22.5W",
      "Recharge Time": "3 hours (with PD charger)",
      Size: "5.9 x 2.9 x 1.0 inches",
      Weight: "12.4 oz (352g)",
      Protection: "Overcharge, over-discharge, short-circuit protection",
    },
    features: [
      "High-density 20000mAh battery capacity",
      "Power Delivery 3.0 & Quick Charge 3.0",
      "Multi-device charging (up to 3 devices)",
      "Digital display shows remaining power",
      "Compact design with aluminum body",
      "Smart power management system",
      "Compatible with smartphones, tablets, and more",
    ],
    variants: {
      color: ["Black", "Silver"],
    },
    stock: 78,
    reviews: [
      {
        id: 1,
        user: "TravelBuff",
        rating: 5,
        comment:
          "This power bank is a lifesaver during trips! Charges my phone multiple times and the digital display is super convenient.",
        date: "2023-05-20",
      },
      {
        id: 2,
        user: "TechGadgetGuy",
        rating: 5,
        comment:
          "Fast charging works perfectly with my iPhone and MacBook. Well worth the investment.",
        date: "2023-06-12",
      },
    ],
  },
  {
    id: 3,
    name: "Bluetooth Wireless Earbuds",
    description:
      "True wireless earbuds with touch controls and long battery life. Sweat and water resistant with premium sound quality.",
    price: 89.99,
    oldPrice: null,
    rating: 4,
    discount: 0,
    images: [
      "/images/earbuds-1.jpg",
      "/images/earbuds-2.jpg",
      "/images/earbuds-3.jpg",
    ],
    category: "Audio",
    brand: "AudioPro",
    specs: {
      "Driver Size": "8mm",
      Connectivity: "Bluetooth 5.2",
      "Battery Life": "8 hours (earbuds), 24 hours (with case)",
      Charging: "USB-C, Wireless Qi",
      "Water Resistance": "IPX4",
      "Noise Cancellation": "Passive",
      Microphone: "4 mics with CVC 8.0",
      Controls: "Touch",
    },
    features: [
      "Premium balanced sound with rich bass",
      "Seamless touch controls for music and calls",
      "IPX4 water and sweat resistance",
      "Customizable EQ via smartphone app",
      "Ultra-lightweight ergonomic design",
      "Voice assistant compatibility",
      "Low-latency gaming mode",
    ],
    variants: {
      color: ["Black", "White"],
    },
    stock: 32,
    reviews: [
      {
        id: 1,
        user: "FitnessFanatic",
        rating: 4,
        comment:
          "Perfect for workouts! They stay in place and the sound quality is impressive for the size.",
        date: "2023-07-05",
      },
      {
        id: 2,
        user: "CommutingPro",
        rating: 4,
        comment:
          "These have become my daily drivers. Good battery life and the case is compact enough for any pocket.",
        date: "2023-08-18",
      },
    ],
  },
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Get first 3 similar products (different from current product)
  const similarProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm justify-between">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link
                href="/products"
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link
                href={`/categories/${product.category.toLowerCase()}`}
                className="text-gray-600 hover:text-black transition-colors duration-200"
              >
                {product.category}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-800 font-medium">{product.name}</span>
            </li>
          </ol>
          <div>
            {product.discount > 0 && (
              <Badge
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-sm px-3 py-1.5 font-medium"
              >
                -{product.discount}% OFF
              </Badge>
            )}
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images Carousel */}
          <div className="space-y-6">
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden shadow-md border-white/20 group">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-3 mt-4">
                <CarouselPrevious className="bg-white/80 hover:bg-white border-white/20 rounded-full" />
                <CarouselNext className="bg-white/80 hover:bg-white border-white/20 rounded-full" />
              </div>
            </Carousel>

            {/* Thumbnails */}
            <div className="flex gap-3 justify-center">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="border-white/20 rounded-lg overflow-hidden w-16 h-16 relative cursor-pointer hover:border-black transition-colors duration-200 bg-gradient-to-br from-gray-50 to-blue-50"
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Badge
                  variant="outline"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 border-blue-200 bg-blue-50"
                >
                  {product.brand}
                </Badge>
                {product.stock > 0 ? (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 bg-green-50 ml-2"
                  >
                    In Stock
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200 bg-red-50 ml-2"
                  >
                    Out of Stock
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
                {product.name}
              </h1>

              <div className="flex items-center mb-5">
                <div className="flex mr-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < product.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.reviews
                    ? `${product.reviews.length} reviews`
                    : "No reviews yet"}
                </span>
              </div>

              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline mb-8">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="ml-3 text-lg text-gray-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
                {product.discount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-3 px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg"
                  >
                    Save ${(product.oldPrice! - product.price).toFixed(2)}
                  </Badge>
                )}
              </div>

              {/* Color & Size Variants */}
              {product.variants?.color && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Color
                  </h3>
                  <div className="flex space-x-3">
                    {product.variants.color.map((color, index) => (
                      <div
                        key={index}
                        className={`
                          w-10 h-10 rounded-full border-2 
                          ${
                            index === 0 ? "border-black" : "border-transparent"
                          } 
                          cursor-pointer flex items-center justify-center hover:border-gray-400 transition-colors duration-200
                        `}
                        title={color}
                      >
                        <span
                          className="w-8 h-8 rounded-full shadow-md"
                          style={{
                            backgroundColor:
                              color.toLowerCase() === "white"
                                ? "#f9fafb"
                                : color.toLowerCase() === "black"
                                ? "#111827"
                                : color.toLowerCase() === "blue"
                                ? "#3b82f6"
                                : color.toLowerCase() === "silver"
                                ? "#e5e7eb"
                                : color,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 font-medium text-lg">
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 font-medium">
                    1
                  </span>
                  <button className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 font-medium text-lg">
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black rounded-full px-8 py-6 text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Add to Cart
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full border-gray-300 hover:border-red-200 hover:bg-red-50 transition-all duration-300 group"
                >
                  <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </Button>
              </div>
            </div>

            {/* Key Features */}
            <Card className="mb-6 border-white/20 shadow-md rounded-xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-br from-gray-50 to-blue-50 border-b border-white/20">
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="text-gray-700">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <div className="flex items-center mb-4 text-sm text-gray-600">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>Free shipping on orders over $50</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
              <span>2-Year limited warranty</span>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-20">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent mb-6 space-x-8">
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none text-gray-600 data-[state=active]:text-gray-900 font-medium transition-colors duration-200"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none text-gray-600 data-[state=active]:text-gray-900 font-medium transition-colors duration-200"
              >
                Reviews
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none text-gray-600 data-[state=active]:text-gray-900 font-medium transition-colors duration-200"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specifications">
              <Card className="border-white/20 shadow-md rounded-xl overflow-hidden bg-white">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    {product.specs &&
                      Object.entries(product.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex border-b border-gray-100 pb-3"
                        >
                          <span className="font-medium text-gray-800 w-1/3">
                            {key}
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="border-white/20 shadow-md rounded-xl overflow-hidden bg-white">
                <CardHeader>
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900">
                    Customer Reviews
                  </CardTitle>
                  <CardDescription>
                    {product.reviews
                      ? `${product.reviews.length} review${
                          product.reviews.length !== 1 ? "s" : ""
                        }`
                      : "No reviews yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {product.reviews?.length ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="pb-6 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-800">
                              {review.user}
                            </span>
                            <span className="text-sm text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Be the first to review this product.
                    </p>
                  )}

                  <Button className="mt-8 bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black rounded-full px-6 py-2 text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Write a Review
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping">
              <Card className="border-white/20 shadow-md rounded-xl overflow-hidden bg-white">
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-medium text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900">
                        Shipping
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        We offer free standard shipping on all orders over $50.
                        For orders under $50, standard shipping is $4.99.
                        Express shipping options are available at checkout.
                      </p>
                      <p className="text-gray-700 mt-3 leading-relaxed">
                        Most orders are processed within 1-2 business days.
                        Delivery times vary by location, but typically range
                        from 3-7 business days.
                      </p>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900">
                        Returns & Exchanges
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        We offer a 30-day return policy for most items in new
                        and unused condition. Return shipping is free for
                        defective items. For non-defective returns, a restocking
                        fee may apply.
                      </p>
                      <p className="text-gray-700 mt-3 leading-relaxed">
                        To initiate a return or exchange, please contact our
                        customer service team or visit your order history in
                        your account.
                      </p>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-medium text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900">
                        Warranty
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        This product comes with a 2-year limited
                        manufacturer&apos;s warranty covering defects in
                        materials and workmanship. For warranty claims, please
                        contact our customer service with your order details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((similarProduct) => (
              <Link
                key={similarProduct.id}
                href={`/products/${similarProduct.id}`}
              >
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] border-white/20 rounded-xl bg-white backdrop-blur-sm group">
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-blue-50 rounded-t-lg">
                    <Image
                      src={similarProduct.images[0]}
                      alt={similarProduct.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />
                    {similarProduct.discount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute top-3 right-3 px-2 py-1 font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg"
                      >
                        -{similarProduct.discount}%
                      </Badge>
                    )}
                    <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {similarProduct.brand}
                    </p>
                    <CardTitle className="text-base group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:via-blue-900 group-hover:to-purple-900 transition-all duration-300">
                      {similarProduct.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-600">
                      {similarProduct.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-baseline">
                      <span className="font-bold text-gray-900">
                        ${similarProduct.price.toFixed(2)}
                      </span>
                      {similarProduct.oldPrice && (
                        <span className="text-gray-400 text-sm line-through ml-2">
                          ${similarProduct.oldPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-yellow-500 flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < similarProduct.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
