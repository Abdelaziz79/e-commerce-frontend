// app/categories/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-category-hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ChevronRight,
  Search,
  Grid3x3,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { Category } from "@/types/category";

// Define the base URL for images, falling back to localhost if not set
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData, isLoading } = useCategories({
    limit: 1000, // Get all categories to build parent/child relationships
    sort: "name", // Sort alphabetically
  });

  const allCategories = categoriesData?.data?.categories || [];

  // Filter categories based on search
  const filteredCategories = allCategories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // We only want to display top-level categories in the main grid
  const parentCategories = filteredCategories.filter(
    (cat: Category) => !cat.parentCategory
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
            <span className="text-foreground font-medium">Categories</span>
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
              <span>Explore Our Collections</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Browse Categories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our wide range of product categories and find exactly
              what you&apos;re looking for
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-full border-2 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Grid3x3 className="h-6 w-6 text-primary" />
              All Categories
            </h2>
            <p className="text-muted-foreground mt-1">
              {parentCategories.length} main categories available
            </p>
          </div>
        </div>

        {isLoading ? (
          <CategoriesGridSkeleton />
        ) : parentCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-8">
              {searchQuery
                ? `No categories match "${searchQuery}"`
                : "No categories available at the moment"}
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parentCategories.map((category: Category) => (
              <CategoryCard
                key={category._id}
                category={category}
                subcategories={allCategories.filter(
                  (cat: Category) => cat.parentCategory === category._id
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Category Card Component
function CategoryCard({
  category,
  subcategories,
}: {
  category: Category;
  subcategories: Category[];
}) {
  const imageUrl = category.image
    ? category.image.startsWith("http")
      ? category.image
      : `${API_BASE_URL}${category.image}`
    : "";

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/50 pt-0">
      <Link href={`/categories/${category.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-background to-muted/50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <LayoutGrid className="h-20 w-20 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="bg-white/90 text-foreground hover:bg-white/90">
              Explore →
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/categories/${category.slug}`} className="group/link">
          <h3 className="font-bold text-xl mb-2 group-hover/link:text-primary transition-colors">
            {category.name}
          </h3>
        </Link>

        {category.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {category.description}
          </p>
        )}

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Grid3x3 className="h-3 w-3" />
              <span>Subcategories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {subcategories.slice(0, 3).map((sub: Category) => (
                <Link
                  key={sub._id}
                  href={`/categories/${sub.slug}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    variant="secondary"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                  >
                    {sub.name}
                  </Badge>
                </Link>
              ))}
              {subcategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subcategories.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* View Category Button */}
        <Link href={`/categories/${category.slug}`}>
          <Button variant="ghost" className="w-full mt-4 group/btn" size="sm">
            <span>View Products</span>
            <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function CategoriesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <CardContent className="p-6">
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-full mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
