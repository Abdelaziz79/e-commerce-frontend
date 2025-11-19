"use client";

import LoadingProducts from "@/components/products/LoadingProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { SortDropdown } from "@/components/products/SortDropdown";
import { ViewModeToggle, ViewMode } from "@/components/products/ViewModeToggle";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  useFavorites,
  useRemoveFromFavorites,
  useAddToCart,
} from "@/hooks/use-cart-favorites";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const { data: favoritesData, isLoading, error } = useFavorites();
  const { mutate: removeFromFavorites, isPending: isRemoving } =
    useRemoveFromFavorites();
  const { mutate: addToCart } = useAddToCart();

  const favorites = useMemo(() => {
    return favoritesData?.data?.favorites || [];
  }, [favoritesData]);

  const sortedFavorites = useMemo(() => {
    if (!favorites.length) return [];
    const sorted = [...favorites];

    switch (sortBy) {
      case "-createdAt":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "-rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "price":
        return sorted.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceA - priceB;
        });
      case "-price":
        return sorted.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceB - priceA;
        });
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "-name":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [favorites, sortBy]);

  const stats = useMemo(() => {
    const totalValue = sortedFavorites.reduce((sum, product) => {
      const price =
        product.onSale && product.salePrice ? product.salePrice : product.price;
      return sum + price;
    }, 0);
    const onSaleCount = sortedFavorites.filter((p) => p.onSale).length;
    const inStockCount = sortedFavorites.filter(
      (p) => p.countInStock > 0
    ).length;
    return { totalValue, onSaleCount, inStockCount };
  }, [sortedFavorites]);

  const handleAddAllToCart = useCallback(() => {
    const inStockProducts = sortedFavorites.filter((p) => p.countInStock > 0);
    if (inStockProducts.length === 0) {
      toast.error("No items in stock to add");
      return;
    }
    inStockProducts.forEach((product: Product) => {
      addToCart({ productId: product._id, quantity: 1 });
    });
    toast.success(`Added ${inStockProducts.length} items to cart`);
  }, [sortedFavorites, addToCart]);

  const handleClearAll = useCallback(() => {
    favorites.forEach((product: Product) => {
      removeFromFavorites(product._id);
    });
    setShowClearDialog(false);
    toast.success("Wishlist cleared");
  }, [favorites, removeFromFavorites]);

  const gridCols = useMemo(() => {
    if (viewMode === "list") return "grid-cols-1";
    if (viewMode === "grid-3")
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  }, [viewMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              My Wishlist
            </h1>
          </div>
          <LoadingProducts />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              My Wishlist
            </h1>
          </div>
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <p className="text-gray-600 mb-4">Failed to load wishlist</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              My Wishlist
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20 md:py-32 border border-gray-200 rounded-lg">
            <div className="mb-6 p-6 bg-gray-50 rounded-full">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6 px-4">
              Save your favorite items here for easy access
            </p>
            <Button
              onClick={() => (window.location.href = "/products")}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {favorites.length} {favorites.length === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleAddAllToCart}
                disabled={stats.inStockCount === 0}
                className="bg-gray-900 hover:bg-gray-800"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add All to Cart
              </Button>
              <Button
                onClick={() => setShowClearDialog(true)}
                disabled={isRemoving}
                variant="outline"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>Total Value:</span>
              <Badge variant="secondary" className="font-medium">
                ${stats.totalValue.toFixed(2)}
              </Badge>
            </div>
            {stats.onSaleCount > 0 && (
              <div className="flex items-center gap-2">
                <span>On Sale:</span>
                <Badge variant="secondary" className="font-medium">
                  {stats.onSaleCount}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>In Stock:</span>
              <Badge variant="secondary" className="font-medium">
                {stats.inStockCount}
              </Badge>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 font-medium">
            {sortedFavorites.length} Products
          </div>
          <div className="flex items-center gap-3">
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        </div>

        {/* Products Grid */}
        <div className={cn("grid gap-0", gridCols)}>
          {sortedFavorites.map((product: Product, index: number) => {
            const isListView = viewMode === "list";
            const cols =
              viewMode === "grid-3" ? 3 : viewMode === "grid-4" ? 4 : 1;
            const position = isListView
              ? "middle"
              : index % cols === 0
              ? "left"
              : index % cols === cols - 1
              ? "right"
              : "middle";
            const isLast = index === sortedFavorites.length - 1;

            return (
              <ProductCard
                key={product._id}
                product={product}
                view={isListView ? "list" : "grid"}
                position={position}
                isLast={isLast}
              />
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center py-8 border-t border-gray-200">
          <Button
            onClick={() => (window.location.href = "/products")}
            variant="outline"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {favorites.length} items from your wishlist.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
