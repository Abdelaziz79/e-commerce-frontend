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
  DropdownMenuLabel,
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
  LayoutDashboard,
  Tag,
  Grid3x3,
  Store,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/auth-context";
import { useLogout } from "@/hooks/use-auth-mutations";
import { useState } from "react";

export function Navbar() {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const [isShopOpen, setIsShopOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isAdmin = user?.role === "admin"; // Adjust based on your user role structure

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 max-w-7xl">
        {/* Logo & Main Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-2xl tracking-tight">
              Tech<span className="font-light">Store</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {/* Shop Dropdown */}
            <DropdownMenu open={isShopOpen} onOpenChange={setIsShopOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black hover:bg-gray-100 font-medium gap-1"
                >
                  Shop
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Browse</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/products" className="cursor-pointer">
                    <Grid3x3 className="mr-2 h-4 w-4" />
                    All Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/categories" className="cursor-pointer">
                    <Tag className="mr-2 h-4 w-4" />
                    Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/brands" className="cursor-pointer">
                    <Store className="mr-2 h-4 w-4" />
                    Brands
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Admin Link */}
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full py-2 pl-4 pr-10 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {!isLoading && user ? (
            <>
              {/* Favorites */}
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex hover:bg-gray-100 rounded-full relative"
                >
                  <Heart className="h-5 w-5 text-gray-700" />
                </Button>
              </Link>

              {/* Cart */}
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

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex hover:bg-gray-100 rounded-full"
                  >
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2 py-3">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    {!user.isEmailVerified && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">
                        ⚠ Email not verified
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
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
                    <Link href="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-purple-600">
                        Admin
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/products" className="cursor-pointer">
                          <Grid3x3 className="mr-2 h-4 w-4" />
                          Manage Products
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          Manage Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/categories"
                          className="cursor-pointer"
                        >
                          <Tag className="mr-2 h-4 w-4" />
                          Categories
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/brands" className="cursor-pointer">
                          <Store className="mr-2 h-4 w-4" />
                          Brands
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Guest Actions */}
              <Link href="/favorites" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 rounded-full"
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
              <Link href="/sign-in" className="hidden md:block">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  Sign In
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
                className="lg:hidden hover:bg-gray-100 rounded-full"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
                {/* Header */}
                <SheetHeader className="px-6 py-5 border-b bg-white/80">
                  <Link href="/" className="flex items-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold text-2xl tracking-tight">
                      Tech<span className="font-light">Store</span>
                    </span>
                  </Link>
                </SheetHeader>

                <div className="flex-1 overflow-auto px-6 py-6">
                  {/* Search */}
                  <div className="relative mb-6">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="w-full py-2 pl-4 pr-10 border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>

                  {/* User Info */}
                  {user && (
                    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Sections */}
                  <div className="space-y-6">
                    {/* Shop Section */}
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Shop
                      </p>
                      <nav className="space-y-2">
                        <Link
                          href="/products"
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                        >
                          <Grid3x3 className="h-5 w-5" />
                          All Products
                        </Link>
                        <Link
                          href="/categories"
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                        >
                          <Tag className="h-5 w-5" />
                          Categories
                        </Link>
                        <Link
                          href="/brands"
                          className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                        >
                          <Store className="h-5 w-5" />
                          Brands
                        </Link>
                      </nav>
                    </div>

                    {/* Account Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Account
                      </p>
                      <nav className="space-y-2">
                        {user ? (
                          <>
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <LayoutDashboard className="h-5 w-5" />
                              Dashboard
                            </Link>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <Package className="h-5 w-5" />
                              My Orders
                            </Link>
                            <Link
                              href="/favorites"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <Heart className="h-5 w-5" />
                              Wishlist
                            </Link>
                            <Link
                              href="/cart"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <ShoppingCart className="h-5 w-5" />
                              Cart
                              <span className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                                0
                              </span>
                            </Link>
                            <Link
                              href="/settings"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <Settings className="h-5 w-5" />
                              Settings
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              href="/sign-in"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <User className="h-5 w-5" />
                              Sign In
                            </Link>
                            <Link
                              href="/register"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <User className="h-5 w-5" />
                              Create Account
                            </Link>
                            <Link
                              href="/favorites"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <Heart className="h-5 w-5" />
                              Wishlist
                            </Link>
                            <Link
                              href="/cart"
                              className="flex items-center gap-3 text-gray-800 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white transition-all"
                            >
                              <ShoppingCart className="h-5 w-5" />
                              Cart
                            </Link>
                          </>
                        )}
                      </nav>
                    </div>

                    {/* Admin Section */}
                    {isAdmin && (
                      <div className="border-t border-gray-200 pt-6">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">
                          Admin
                        </p>
                        <nav className="space-y-2">
                          <Link
                            href="/admin/products"
                            className="flex items-center gap-3 text-purple-700 hover:text-purple-800 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 transition-all"
                          >
                            <Grid3x3 className="h-5 w-5" />
                            Manage Products
                          </Link>
                          <Link
                            href="/admin/orders"
                            className="flex items-center gap-3 text-purple-700 hover:text-purple-800 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 transition-all"
                          >
                            <Package className="h-5 w-5" />
                            Manage Orders
                          </Link>
                          <Link
                            href="/admin/categories"
                            className="flex items-center gap-3 text-purple-700 hover:text-purple-800 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 transition-all"
                          >
                            <Tag className="h-5 w-5" />
                            Categories
                          </Link>
                          <Link
                            href="/admin/brands"
                            className="flex items-center gap-3 text-purple-700 hover:text-purple-800 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 transition-all"
                          >
                            <Store className="h-5 w-5" />
                            Brands
                          </Link>
                        </nav>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Button */}
                <div className="px-6 py-4 border-t bg-white/80">
                  {user ? (
                    <Button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/sign-in">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
