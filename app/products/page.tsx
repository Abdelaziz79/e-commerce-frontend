import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function ProductsPage() {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Filters Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <Card className="sticky top-24 bg-white border-white/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="font-bold text-xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
                  Filters
                </h2>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Toggle
                          aria-label={`Filter by ${category}`}
                          className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-gray-900 data-[state=on]:to-blue-900 data-[state=on]:text-white transition-colors duration-200 w-full justify-start text-sm rounded-full"
                        >
                          {category}
                        </Toggle>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Brand</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Toggle
                          aria-label={`Filter by ${brand}`}
                          className="data-[state=on]:bg-gradient-to-r data-[state=on]:from-gray-900 data-[state=on]:to-blue-900 data-[state=on]:text-white transition-colors duration-200 w-full justify-start text-sm rounded-full"
                        >
                          {brand}
                        </Toggle>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Price Range
                  </h3>
                  <div className="mb-6 px-2">
                    <Slider
                      defaultValue={[0, 200]}
                      max={500}
                      step={10}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <div className="w-1/2 pr-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          defaultValue={0}
                          className="border-gray-300 rounded-full focus:outline-none focus:border-black transition-all duration-300 bg-white/80"
                        />
                      </div>
                      <div className="w-1/2 pl-2">
                        <Input
                          type="number"
                          placeholder="Max"
                          defaultValue={200}
                          className="border-gray-300 rounded-full focus:outline-none focus:border-black transition-all duration-300 bg-white/80"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <Toggle
                        key={rating}
                        aria-label={`${rating} stars and up`}
                        className="w-full justify-start data-[state=on]:bg-gradient-to-r data-[state=on]:from-gray-900 data-[state=on]:to-blue-900 data-[state=on]:text-white transition-colors duration-200 text-sm rounded-full"
                      >
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          <span className="ml-1">& Up</span>
                        </div>
                      </Toggle>
                    ))}
                  </div>
                </div>

                <Separator className="my-5" />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="w-1/2 transition-all duration-300 border-gray-300 hover:border-black hover:bg-black hover:text-white rounded-full"
                  >
                    Reset
                  </Button>
                  <Button className="w-1/2 bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all duration-300 hover:scale-105 shadow-lg rounded-full">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
                All Products
              </h1>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                    >
                      Most Popular
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white border border-white/20 shadow-lg rounded-lg backdrop-blur-sm"
                  >
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50">
                      Newest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                {products.length} products found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="border-gray-300 text-gray-400 rounded-full"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all duration-300 rounded-full"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                >
                  3
                </Button>
                <span className="px-2 text-gray-400">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                >
                  10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 rounded-full"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] bg-white border-white/20 rounded-xl backdrop-blur-sm group">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg"
            >
              -{product.discount}%
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
        <CardContent className="p-5 flex-1 flex flex-col">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:via-blue-900 group-hover:to-purple-900 transition-all duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-auto">
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-baseline">
                <span className="font-bold text-lg text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-sm line-through ml-2">
                    ${product.oldPrice.toFixed(2)}
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
                        i < product.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-100 p-5 pt-3">
          <Button className="w-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black px-6 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// Sample data
const categories = [
  "Audio",
  "Chargers",
  "Storage",
  "Accessories",
  "Cables",
  "Protective Gear",
  "Power Banks",
];

const brands = [
  "SonicWave",
  "PowerMax",
  "AudioPro",
  "PowerLink",
  "ShieldPro",
  "DataFlash",
  "CasePro",
];

const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headset",
    description:
      "Immersive sound quality with noise cancellation for an exceptional audio experience",
    price: 129.99,
    oldPrice: 179.99,
    rating: 4,
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
    rating: 5,
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
    rating: 4,
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
    rating: 4,
    discount: 25,
    image: "/images/usb-1.jpg",
    category: "Storage",
    brand: "DataFlash",
  },
  {
    id: 5,
    name: "Compact Car Charger",
    description:
      "Dual-port fast charging car adapter with smart power management",
    price: 19.99,
    oldPrice: null,
    rating: 4,
    discount: 0,
    image: "/images/car-charger-1.jpg",
    category: "Chargers",
    brand: "PowerDrive",
  },
  {
    id: 6,
    name: "Premium Bluetooth Speaker",
    description: "Waterproof portable speaker with 360° surround sound",
    price: 79.99,
    oldPrice: 99.99,
    rating: 5,
    discount: 20,
    image: "/images/speaker-1.jpg",
    category: "Audio",
    brand: "SoundBox",
  },
  {
    id: 7,
    name: "USB-C Fast Charging Cable",
    description: "Durable braided cable with fast charging capabilities",
    price: 14.99,
    oldPrice: 19.99,
    rating: 4,
    discount: 25,
    image: "/images/wired-usb-c-1.jpg",
    category: "Cables",
    brand: "PowerLink",
  },
  {
    id: 8,
    name: "Tempered Glass Screen Protector",
    description: "Edge-to-edge protection with oleophobic coating",
    price: 12.99,
    oldPrice: 19.99,
    rating: 4,
    discount: 35,
    image: "/images/screen-protector-1.jpg",
    category: "Protective Gear",
    brand: "ShieldPro",
  },
  {
    id: 9,
    name: "Premium Phone Case",
    description: "Military-grade drop protection with slim profile design",
    price: 24.99,
    oldPrice: 34.99,
    rating: 5,
    discount: 28,
    image: "/images/protective-case-1.jpg",
    category: "Protective Gear",
    brand: "CasePro",
  },
];
