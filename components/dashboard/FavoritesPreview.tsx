// components/dashboard/FavoritesPreview.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAddToCart } from "@/hooks/use-cart-favorites";

interface FavoritesPreviewProps {
  favorites: Product[];
  totalCount: number;
}

export function FavoritesPreview({
  favorites,
  totalCount,
}: FavoritesPreviewProps) {
  const { mutate: addToCart } = useAddToCart();

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              You haven&apos;t added any favorites yet
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>
          Favorites{" "}
          {totalCount > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({totalCount})
            </span>
          )}
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/wishlist" className="gap-1">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <Link href={`/products/${product.slug || product._id}`}>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.mainImage || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.onSale && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.onSale && product.salePrice ? (
                      <>
                        <span className="text-sm font-bold text-red-600">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
