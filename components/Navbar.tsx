import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 font-bold text-2xl tracking-tight">
              Tech<span className="font-light">Store</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/products"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="text-gray-600 hover:text-black transition-colors"
            >
              About
            </Link>
            <Link
              href="/offers"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-black transition-all duration-300 bg-white/80"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex hover:bg-gray-100 rounded-full"
          >
            <User className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex hover:bg-gray-100 rounded-full"
          >
            <Heart className="h-5 w-5 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full relative"
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              0
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 rounded-full"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          <Link href="/sign-in" className="hidden md:block">
            <Button
              variant="default"
              className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black px-6 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
