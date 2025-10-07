// app/brands/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBrands } from "@/hooks/use-brand-hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ChevronRight,
  Search,
  Sparkles,
  Store,
  ExternalLink,
  Tag,
} from "lucide-react";
import { Brand } from "@/types/brand";

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: brandsData, isLoading } = useBrands({
    limit: 100, // Get all brands
    sort: "name", // Sort alphabetically
  });

  const brands = brandsData?.data?.brands || [];

  // Filter brands based on search
  const filteredBrands = brands.filter((brand: Brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Breadcrumb */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Brands</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Discover Premium Brands</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Shop by Brand
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Explore our curated collection of trusted brands and manufacturers
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-full border-2 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              All Brands
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredBrands.length} brands available
            </p>
          </div>
        </div>

        {isLoading ? (
          <BrandsGridSkeleton />
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No brands found</h3>
            <p className="text-muted-foreground mb-8">
              {searchQuery
                ? `No brands match "${searchQuery}"`
                : "No brands available at the moment"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand: Brand) => (
              <BrandCard key={brand._id} brand={brand} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Brand Card Component
function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/50 pt-0">
      <Link href={`/brands/${brand.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-8">
          {brand.logo ? (
            <div className="relative w-full h-full">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Store className="h-20 w-20 text-primary/20 mb-4" />
              <span className="text-2xl font-bold text-foreground/80">
                {brand.name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Brand Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="bg-white/90 text-foreground hover:bg-white/90">
              Explore →
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/brands/${brand.slug}`} className="group/link">
          <h3 className="font-bold text-xl mb-2 group-hover/link:text-primary transition-colors flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            {brand.name}
          </h3>
        </Link>

        {brand.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {brand.description}
          </p>
        )}

        {/* Website Link */}
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Visit Website</span>
          </a>
        )}

        {/* View Brand Button */}
        <Link href={`/brands/${brand.slug}`}>
          <Button variant="ghost" className="w-full mt-2 group/btn" size="sm">
            <span>View Products</span>
            <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function BrandsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <CardContent className="p-6">
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
