// components/Footer.tsx

"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* 1. Brand & Newsletter (Span 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
                <span className="text-lg font-bold">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                TechStore
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Experience tomorrow&apos;s technology today. Premium electronics
              with industry-leading warranty and support.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2 max-w-sm">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter your email"
                    className="pl-9 bg-gray-50 border-gray-200 focus:bg-white rounded-full h-10 text-sm transition-all"
                  />
                </div>
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 bg-gray-900 hover:bg-gray-800 shrink-0"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Subscribe</span>
                </Button>
              </div>
            </div>
          </div>

          {/* 2. Links Sections (Span 8 columns total) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Shop Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "All Products", href: "/products" },
                  { label: "New Arrivals", href: "/products?sort=-createdAt" },
                  { label: "Featured", href: "/products?featured=true" },
                  { label: "Categories", href: "/categories" },
                  { label: "Brands", href: "/brands" },
                ].map((item) => (
                  // FIX: Using item.label as key instead of href
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { label: "My Account", href: "/dashboard" },
                  { label: "Order Status", href: "/orders" },
                  { label: "Wishlist", href: "/wishlist" },
                  { label: "Help Center", href: "#" },
                  { label: "Returns", href: "#" },
                ].map((item) => (
                  // FIX: Using item.label as key helps avoid duplicate key error when hrefs are identical ('#')
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    123 Tech Blvd,
                    <br />
                    Silicon Valley, CA 94000
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>hello@techstore.com</span>
                </li>
              </ul>

              {/* Socials */}
              <div className="flex gap-1 mt-6">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Instagram, label: "Instagram" },
                  { icon: Twitter, label: "Twitter" },
                ].map((social, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} TechStore Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-gray-900 transition-colors"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
