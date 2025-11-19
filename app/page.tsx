// app/page.tsx

"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useCategories } from "@/hooks/use-category-hooks";
import { useFeaturedProducts, useProducts } from "@/hooks/use-product-queries";
import { getImageSrc } from "@/lib/utils";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import {
  ArrowRight,
  ImageIcon,
  ShieldCheck,
  Truck,
  Zap,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// --- Helper Components ---

// 1. Section Header (Minimalist)
function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {href && (
        <Button
          variant="link"
          asChild
          className="text-gray-500 hover:text-gray-900 p-0"
        >
          <Link href={href} className="flex items-center gap-1">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

// 2. Loading Skeleton
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white p-6">
          <Skeleton className="aspect-square w-full mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

// 3. Category Card (Pill Shape for Modern Look)
function CategoryCard({ category }: { category: Category }) {
  const imageUrl = category.image ? getImageSrc(category.image) : "";

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col items-center gap-3"
    >
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-50 border border-gray-100 group-hover:border-gray-300 group-hover:shadow-md transition-all duration-300 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 96px, 128px" // Added sizes prop here
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-300" />
        )}
      </div>
      <span className="font-medium text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
        {category.name}
      </span>
    </Link>
  );
}

export default function HomePage() {
  // --- Data Fetching ---
  const { data: featuredData, isLoading: isFeaturedLoading } =
    useFeaturedProducts(4);
  const { data: newArrivalsData, isLoading: isNewLoading } = useProducts({
    sort: "-createdAt",
    limit: 4,
  });
  const { data: brandsData } = useBrands({ limit: 8 });
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories({ limit: 6 });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION (Minimal & Clean) */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider">
                New Season Arrivals
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">
                Tech is Here.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
              Upgrade your lifestyle with premium electronics. Simple, powerful,
              and designed for the modern creator.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 h-12 bg-gray-900 hover:bg-black text-white text-base w-full sm:w-auto"
                asChild
              >
                <Link href="/products">Shop Collection</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 border-gray-300 hover:bg-gray-50 text-gray-700 text-base w-full sm:w-auto"
                asChild
              >
                <Link href="/categories">Explore Categories</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Subtle Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-3xl" />
        </div>
      </section>

      {/* 2. CATEGORIES (Visual Navigation) */}
      <section className="py-16 sm:py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          {isCategoriesLoading ? (
            <div className="flex justify-center gap-8 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-24 rounded-full" />
              ))}
            </div>
          ) : categoriesData?.data.categories &&
            categoriesData.data.categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              {categoriesData.data.categories.map((category: Category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Clean Grid) */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Collection"
            href="/products?featured=true"
          />

          {isFeaturedLoading ? (
            <ProductGridSkeleton />
          ) : featuredData?.data && featuredData.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 ">
              {featuredData.data.map((product: Product, index: number) => (
                <div key={product._id} className="h-full">
                  <ProductCard
                    product={product}
                    view="grid"
                    position={
                      index % 4 === 0
                        ? "left"
                        : index % 4 === 3
                        ? "right"
                        : "middle"
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">No featured products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. PROMO BANNER (Modern Split) */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-3xl overflow-hidden text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-10 sm:p-16">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6">
                  Limited Time Offer
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">
                  Level Up Your <br /> Workstation
                </h2>
                <p className="text-gray-400 text-lg mb-8 max-w-md">
                  Save up to 40% on premium accessories, monitors, and keyboards
                  this week only.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 font-semibold"
                  asChild
                >
                  <Link href="/products?onSale=true">Get Access</Link>
                </Button>
              </div>
              <div className="h-64 md:h-full min-h-[300px] relative bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                {/* Abstract shape */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
                </div>
                <Smartphone className="w-32 h-32 text-gray-700 relative z-10 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader title="Fresh Drops" href="/products?sort=-createdAt" />

          {isNewLoading ? (
            <ProductGridSkeleton />
          ) : newArrivalsData?.data && newArrivalsData.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 ">
              {newArrivalsData.data.map((product: Product, index: number) => (
                <div key={product._id} className="h-full">
                  <ProductCard
                    product={product}
                    view="grid"
                    position={
                      index % 4 === 0
                        ? "left"
                        : index % 4 === 3
                        ? "right"
                        : "middle"
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-gray-500">No new arrivals yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. VALUE PROPOSITION (Simple Icons) */}
      <section className="py-20 border-t border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-5 text-gray-900">
                <Truck className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Free Global Shipping
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                On all orders over $100. Tracked and insured delivery to your
                doorstep.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-5 text-gray-900">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Secure Warranty
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Every product includes a 2-year comprehensive warranty for peace
                of mind.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-5 text-gray-900">
                <Zap className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Fast Returns
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Change your mind? Return unused items within 30 days for a full
                refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BRANDS (Grayscale to Color) */}
      <section className="py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-10">
            Trusted by industry leaders
          </p>

          {!brandsData || brandsData.data.brands.length === 0 ? null : (
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {brandsData.data.brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand.slug}`}
                  className="group opacity-50 hover:opacity-100 transition-all duration-300"
                >
                  {brand.logo ? (
                    <div className="relative h-8 w-24 sm:h-10 sm:w-32 grayscale group-hover:grayscale-0 transition-all duration-300">
                      {/* FIX: Added sizes prop */}
                      <Image
                        src={getImageSrc(brand.logo)}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100px, 150px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
