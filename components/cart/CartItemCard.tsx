// components/cart/CartItemCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/use-cart-favorites";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { Loader2, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getImageSrc } from "@/lib/utils";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const getProductId = (product: Product | string): string => {
    if (typeof product === "string") return product;
    return product?._id || "";
  };

  const productId = getProductId(item.product);
  const isOutOfStock = item.stockStatus === "out_of_stock";
  const isUnavailable = item.stockStatus === "unavailable";

  const handleUpdateQuantity = async (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateCartItem.mutateAsync({
        productId,
        data: {
          quantity: newQuantity,
          variationSku: item.variation?.sku,
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = () => {
    removeFromCart.mutate({ productId, variationSku: item.variation?.sku });
  };

  return (
    <Card className="group p-6 transition-all hover:shadow-lg border-slate-200">
      <div className="flex gap-6">
        {/* Product Image - Now clickable and better sizing */}
        <Link
          href={`/products/${productId}`}
          className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden "
        >
          <Image
            src={getImageSrc(item.image)}
            alt={item.name}
            fill
            className="object-contain p-2 transition-transform "
            sizes="128px"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${productId}`}
                className="text-base font-semibold text-slate-900 hover:text-slate-600 line-clamp-2 block transition-colors"
              >
                {item.name}
              </Link>

              {/* Variation Details */}
              {item.variation && (
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-2">
                  {item.variation.color && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-slate-400">Color:</span>
                      <span className="font-medium text-slate-700">
                        {item.variation.color}
                      </span>
                    </span>
                  )}
                  {item.variation.size && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-slate-400">Size:</span>
                      <span className="font-medium text-slate-700">
                        {item.variation.size}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveItem}
              disabled={removeFromCart.isPending}
              className="h-9 w-9 flex-shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove item from cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges Section */}
          <div className="flex flex-wrap gap-2 mb-auto">
            {item.priceChanged && item.currentPrice && (
              <Badge
                variant="default"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
              >
                Price updated: ${item.currentPrice.toFixed(2)}
              </Badge>
            )}
            {(isOutOfStock || isUnavailable) && (
              <Badge
                variant="destructive"
                className="bg-red-50 text-red-700 border-red-200 font-medium"
              >
                {isUnavailable ? "No longer available" : "Out of stock"}
              </Badge>
            )}
          </div>

          {/* Bottom Section: Quantity and Price */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white hover:text-slate-900 rounded-md disabled:opacity-50 transition-colors"
                onClick={() => handleUpdateQuantity(-1)}
                disabled={
                  isUpdating ||
                  item.quantity <= 1 ||
                  isOutOfStock ||
                  isUnavailable
                }
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>

              <div className="w-12 text-center text-sm font-semibold text-slate-900">
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-white hover:text-slate-900 rounded-md disabled:opacity-50 transition-colors"
                onClick={() => handleUpdateQuantity(1)}
                disabled={
                  isUpdating ||
                  (item.maxQuantity !== undefined &&
                    item.quantity >= item.maxQuantity) ||
                  isOutOfStock ||
                  isUnavailable
                }
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">
                $
                {((item.currentPrice || item.price) * item.quantity).toFixed(2)}
              </p>
              {item.priceChanged && (
                <p className="text-sm text-slate-400 line-through mt-0.5">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
