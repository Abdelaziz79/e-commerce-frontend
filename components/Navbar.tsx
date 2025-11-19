"use client";

import {
  Heart,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Hooks
import { useLogout } from "@/hooks/use-auth-mutations";
import { useCartCount, useFavorites } from "@/hooks/use-cart-favorites";
import { useUserAvatar, useUserProfile } from "@/hooks/use-user-mutations";

// Components
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Auth & Data
  const { data } = useUserProfile();
  const user = data?.data;
  const isAuthenticated = !!user;
  const logoutMutation = useLogout();
  const cartCount = useCartCount();
  const { data: favoritesData } = useFavorites();
  const avatarUrl = useUserAvatar();

  const favoritesCount = favoritesData?.data?.favorites?.length || 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b border-gray-200"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* 1. LEFT: Logo & Mobile Trigger */}
          <div className="flex items-center gap-3 lg:gap-8">
            {/* Mobile Menu */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden -ml-2 text-gray-600"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[400px] p-0 border-r border-gray-100"
              >
                <SheetHeader className="p-6 border-b border-gray-100 text-left">
                  <SheetTitle className="font-bold text-xl tracking-tight">
                    TechStore
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="p-6 pb-2">
                    <GlobalSearch
                      onSearchSubmit={() => setIsSheetOpen(false)}
                    />
                  </div>
                  <nav className="flex flex-col px-2 py-4 gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className={cn(
                          "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                          pathname === link.href
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  {isAuthenticated && (
                    <div className="mt-auto border-t border-gray-100 p-4 space-y-1">
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/orders"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm transition-transform group-hover:scale-105">
                <span className="text-lg font-bold">T</span>
              </div>
              <span className="hidden text-xl font-bold tracking-tight text-gray-900 lg:inline-block">
                TechStore
              </span>
            </Link>
          </div>

          {/* 2. CENTER: Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-gray-900 bg-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 3. RIGHT: Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block w-[240px] lg:w-[280px]">
              <GlobalSearch className="h-10" />
            </div>

            {/* Actions Group */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-11 w-11 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                  <span className="sr-only">Wishlist</span>
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-11 w-11 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>

              {/* User Profile / Login */}
              {isAuthenticated && user ? (
                <div className="pl-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-gray-200"
                      >
                        <Avatar className="h-9 w-9 border border-gray-200">
                          <AvatarImage
                            src={avatarUrl}
                            alt={user.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gray-100 text-gray-700 font-medium text-xs">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-56 p-1 mt-1 rounded-xl border-gray-200 shadow-lg shadow-gray-200/50"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal p-3 mb-1">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuGroup className="p-1">
                        {user.role === "admin" && (
                          <DropdownMenuItem
                            asChild
                            className="rounded-lg focus:bg-gray-50 cursor-pointer"
                          >
                            <Link href="/admin">
                              <ShieldCheck className="mr-2 h-4 w-4 text-indigo-600" />
                              <span>Admin Panel</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg focus:bg-gray-50 cursor-pointer"
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg focus:bg-gray-50 cursor-pointer"
                        >
                          <Link href="/orders">
                            <Package className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Orders</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="rounded-lg focus:bg-gray-50 cursor-pointer"
                        >
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4 text-gray-500" />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <div className="p-1">
                        <DropdownMenuItem
                          className="rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                          onClick={handleLogout}
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <LogOut className="mr-2 h-4 w-4" />
                          )}
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-gray-200 pl-4">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    asChild
                  >
                    <Link href="/sign-in">Log in</Link>
                  </Button>
                  <Button
                    className="rounded-full px-5 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                    asChild
                  >
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
