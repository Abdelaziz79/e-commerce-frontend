// components/favorites/FavoriteProductCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAddToCart,
  useRemoveFromFavorites,
} from "@/hooks/use-cart-favorites";
import { Product } from "@/types/product";
import { Loader2, ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FavoriteProductCardProps {
  product: Product;
}

export function FavoriteProductCard({ product }: FavoriteProductCardProps) {
  const removeFromFavorites = useRemoveFromFavorites();
  const addToCart = useAddToCart();

  const handleRemoveFavorite = () => {
    removeFromFavorites.mutate(product._id);
  };

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product._id, quantity: 1 });
  };

  const currentPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;
  const isOnSale = product.onSale && product.salePrice;
  const discountPercent = isOnSale
    ? Math.round(((product.price - currentPrice) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative overflow-hidden flex flex-col">
      {/* Header with Sale Badge and Remove Button */}
      <div className="absolute top-2 left-2 right-2 z-10 flex justify-between items-start">
        {isOnSale ? (
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercent}%
          </div>
        ) : (
          <div />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/90 hover:bg-white shadow-sm h-8 w-8"
          onClick={handleRemoveFavorite}
          disabled={removeFromFavorites.isPending}
          aria-label="Remove from wishlist"
        >
          {removeFromFavorites.isPending &&
          removeFromFavorites.variables === product._id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 text-red-500" />
          )}
        </Button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.mainImage || product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link
          href={`/products/${product._id}`}
          className="block hover:text-primary"
        >
          <h3 className="font-semibold line-clamp-2 mb-2 h-12">
            {product.name}
          </h3>
        </Link>
        <div className="flex-grow">
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">
                ({product.numReviews})
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold">
              ${currentPrice.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          {product.countInStock === 0 ? (
            <p className="text-sm text-red-600 mb-3">Out of stock</p>
          ) : product.countInStock < 10 ? (
            <p className="text-sm text-orange-600 mb-3">
              Only {product.countInStock} left
            </p>
          ) : (
            <div className="mb-3 h-[20px]" />
          )}
        </div>
        <Button
          className="w-full mt-auto"
          onClick={handleAddToCart}
          disabled={
            product.countInStock === 0 ||
            (addToCart.isPending &&
              addToCart.variables?.productId === product._id)
          }
        >
          {addToCart.isPending &&
          addToCart.variables?.productId === product._id ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
