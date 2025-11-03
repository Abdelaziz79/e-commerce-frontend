// app/categories/[slug]/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-category-hooks";
import { useProducts } from "@/hooks/use-product-queries";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import {
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  ShoppingCart,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// Define the base URL for images
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);

  // Step 1: Fetch all categories to reliably find the one matching the slug.
  // A high limit ensures we get all of them, fixing the "not found" bug for items on later pages.
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 1000,
  });

  // Step 2: Find the category on the client side from the complete list.
  // This will be `undefined` until `categoriesData` is available.
  const category = categoriesData?.data?.categories?.find(
    (cat: Category) => cat.slug === slug
  );

  // Step 3: Fetch products for this category.
  // CRITICAL FIX: The `enabled: !!category?._id` option tells react-query
  // to WAIT until `category` is found and we have an ID.
  // This prevents the `GET /api/v1/products?category=undefined` request that causes the 500 error.
  const { data: productsData, isLoading: productsLoading } = useProducts({
    category: category?._id,
    page: currentPage,
    limit: 12,
    sort: sortBy,
  });

  // Step 4: A combined loading state that mirrors the logic from your working BrandPage.
  // We are "loading" if the category list is loading, OR if we have found the category
  // and are now waiting for its products to load.
  const isLoading = categoriesLoading || (!!category && productsLoading);

  // Step 5: Show the main page skeleton ONLY while fetching the category list.
  // This ensures we don't flash the "Not Found" page prematurely.
  if (categoriesLoading) {
    return <CategoryPageSkeleton />;
  }

  // Step 6: After we're done fetching categories, if no category was found, show the "Not Found" page.
  // This is now accurate because we have searched the *entire* list.
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The category you&apos;re looking for either doesn&apos;t exist or is
          not currently active.
        </p>
        <Button asChild>
          <Link href="/categories">Browse All Categories</Link>
        </Button>
      </div>
    );
  }

  const products = productsData?.data || [];
  const totalPages = productsData?.pages || 1;

  const imageUrl = category.image
    ? category.image.startsWith("http")
      ? category.image
      : `${API_BASE_URL}${category.image}`
    : "";

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
            <Link
              href="/categories"
              className="hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {imageUrl && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-background bg-background">
                <Image
                  src={imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="text-sm">
                  <LayoutGrid className="h-3 w-3 mr-1" />
                  {productsData?.total || 0} Products
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>
                Showing {products.length} of {productsData?.total || 0} products
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="-price">Price: High to Low</SelectItem>
                  <SelectItem value="-rating">Top Rated</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? ( // Use the combined loading state here
          <ProductsGridSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <LayoutGrid className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-8">
              There are no products in this category yet.
            </p>
            <Button asChild>
              <Link href="/">Browse All Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className="w-9 h-9"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const finalPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;
  const discount =
    product.onSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const mainImageUrl = product.mainImage || product.images[0];
  const fullImageUrl = mainImageUrl.startsWith("http")
    ? mainImageUrl
    : `${API_BASE_URL}${mainImageUrl}`;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-muted">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={fullImageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.onSale && discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive">
              -{discount}%
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" variant="secondary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button size="icon" variant="secondary">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link
          href={`/products/${product.slug}`}
          className="hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.numReviews})
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">
            ${finalPrice.toFixed(2)}
          </span>
          {product.onSale && product.salePrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeletons
function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
          <Skeleton className="w-32 h-32 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </div>
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-44" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ProductsGridSkeleton />
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
