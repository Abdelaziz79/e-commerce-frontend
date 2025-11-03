// app/brands/[slug]/page.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useProducts } from "@/hooks/use-product-queries";
import { Brand } from "@/types/brand";
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

// Define the base URL for images, falling back to localhost if not set
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export default function BrandPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all brands to find the one with matching slug
  const { data: brandsData, isLoading: brandsLoading } = useBrands();

  // Find brand by slug
  const brand = brandsData?.data?.brands?.find((b: Brand) => b.slug === slug);

  // --- FIX START ---
  // Fetch products for this brand, but ONLY if the brand ID exists.
  // The `enabled` option prevents the query from running if `brand?._id` is falsy (e.g., undefined).
  const { data: productsData, isLoading: productsLoading } = useProducts({
    brand: brand?._id,
    page: currentPage,
    limit: 12,
    sort: sortBy,
  });
  // --- FIX END ---

  // Combined loading state should reflect both queries
  const isLoading = brandsLoading || (!!brand && productsLoading);

  // --- FIX: Show skeleton while brands are loading and we haven't determined if the brand exists yet ---
  if (brandsLoading) {
    return <BrandPageSkeleton />;
  }

  // If, after loading, the brand is still not found, show the "Not Found" page.
  // This now correctly handles inactive brands because they won't be in `brandsData`.
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The brand you&apos;re looking for either doesn&apos;t exist or is not
          currently active.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  const products = productsData?.data || [];
  const totalPages = productsData?.pages || 1;

  // Construct the full logo URL.
  const logoUrl = brand.logo
    ? brand.logo.startsWith("http")
      ? brand.logo
      : `${API_BASE_URL}${brand.logo}`
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
              href="/brands"
              className="hover:text-foreground transition-colors"
            >
              Brands
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {logoUrl && (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-background">
                <Image
                  src={logoUrl}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {brand.description}
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
                  <SelectItem value="featured">Featured</SelectItem>
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
              There are no products for this brand yet.
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
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
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

// Product Card Component (No changes needed)
function ProductCard({ product }: { product: Product }) {
  const finalPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;
  const discount =
    product.onSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-muted">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.mainImage || product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.onSale && discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive">
              -{discount}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary">
              Featured
            </Badge>
          )}
          {product.isNewProduct && (
            <Badge className="absolute top-12 right-3 bg-green-600 hover:bg-green-600">
              New
            </Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" variant="secondary">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button size="sm" variant="secondary">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link
          href={`/products/${product._id}`}
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
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        {product.countInStock > 0 ? (
          <span className="text-green-600">
            In Stock ({product.countInStock})
          </span>
        ) : (
          <span className="text-destructive">Out of Stock</span>
        )}
      </CardFooter>
    </Card>
  );
}

// Loading Skeletons (No changes needed)
function BrandPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8 items-center mb-12">
          <Skeleton className="w-32 h-32 rounded-2xl" />
          <div className="flex-1">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96" />
          </div>
        </div>
      </div>
      <ProductsGridSkeleton />
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square" />
          <CardContent className="p-4">
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
