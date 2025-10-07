// components/Navbar.tsx (Updated with auth-aware functionality)
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth-context";
import { useLogout } from "@/hooks/use-auth-mutations";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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
          {/* Auth-aware user menu */}
          {!isLoading && user ? (
            <>
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-gray-100 rounded-full"
                >
                  <Heart className="h-5 w-5 text-gray-700" />
                </Button>
              </Link>
              <Link href="/cart">
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
              </Link>
              {/* User dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex hover:bg-gray-100 rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {!user.isEmailVerified && (
                      <p className="text-xs text-amber-600 mt-1">
                        Email not verified
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex hover:bg-gray-100 rounded-full"
              >
                <User className="h-5 w-5 text-gray-700" />
              </Button>
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-gray-100 rounded-full"
                >
                  <Heart className="h-5 w-5 text-gray-700" />
                </Button>
              </Link>
              <Link href="/cart">
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
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-gray-100 rounded-full"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <SheetHeader className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 font-bold text-2xl tracking-tight">
                        Tech<span className="font-light">Store</span>
                      </span>
                    </Link>
                  </div>
                </SheetHeader>
                <div className="px-6 py-8 flex-1 overflow-auto">
                  {/* Search */}
                  <div className="relative mb-8">
                    <Input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-black transition-all duration-300 bg-white/80"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Main Menu
                      </p>
                      <nav className="flex flex-col space-y-4">
                        <Link
                          href="/products"
                          className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                        >
                          Shop
                        </Link>
                        <Link
                          href="/categories"
                          className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                        >
                          About
                        </Link>
                        <Link
                          href="/offers"
                          className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                        >
                          Contact
                        </Link>
                      </nav>
                    </div>

                    <div className="border-t border-gray-100 pt-6 space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Account
                      </p>
                      <nav className="flex flex-col space-y-4">
                        {user ? (
                          <>
                            <div className="text-sm text-gray-600 mb-2">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs">{user.email}</p>
                            </div>
                            <Link
                              href="/dashboard"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                            >
                              Dashboard
                            </Link>
                            <Link
                              href="/orders"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                            >
                              My Orders
                            </Link>
                            <Link
                              href="/favorites"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors flex items-center"
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              Wishlist
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/sign-in"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/register"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors"
                            >
                              Create Account
                            </Link>
                            <Link
                              href="/favorites"
                              className="text-gray-800 hover:text-black font-medium text-lg transition-colors flex items-center"
                            >
                              <Heart className="mr-2 h-4 w-4" />
                              Wishlist
                            </Link>
                          </>
                        )}
                        <Link
                          href="/cart"
                          className="text-gray-800 hover:text-black font-medium text-lg transition-colors flex items-center"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Cart
                          <span className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            0
                          </span>
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 px-6 py-6 rounded-full text-base font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Sign out
                    </Button>
                  ) : (
                    <Link href="/sign-in">
                      <Button className="w-full bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black px-6 py-6 rounded-full text-base font-medium transform hover:scale-105 transition-all duration-300 shadow-lg">
                        Sign in
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Sign In Button (only show when not authenticated) */}
          {!isLoading && !user && (
            <Link href="/sign-in" className="hidden md:block">
              <Button
                variant="default"
                className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black px-6 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
