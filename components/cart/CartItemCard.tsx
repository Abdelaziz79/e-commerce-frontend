// components/cart/CartItemCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useRemoveFromCart,
  useUpdateCartItem,
} from "@/hooks/use-cart-favorites";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart"; // Assuming CartItem is in the user types
import { Loader2, Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to safely get product ID, as product can be populated or just an ID string
  const getProductId = (product: Product | string): string => {
    if (typeof product === "string") return product;
    return product?._id || "";
  };

  const productId = getProductId(item.product);
  const isOutOfStock = item.stockStatus === "out_of_stock";
  const isUnavailable = item.stockStatus === "unavailable";

  const handleUpdateQuantity = async (change: number) => {
    const newQuantity = item.quantity + change;
    // Prevent quantity from going below 1
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
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              {/* Product Name and Link */}
              <Link
                href={`/products/${productId}`}
                className="font-semibold hover:underline"
              >
                {item.name}
              </Link>

              {/* Variation Details */}
              {item.variation && (
                <div className="text-sm text-gray-600 mt-1">
                  {item.variation.size && (
                    <span>Size: {item.variation.size}</span>
                  )}
                  {item.variation.color && (
                    <span className="ml-2">Color: {item.variation.color}</span>
                  )}
                </div>
              )}

              {/* Price Update Notification */}
              {item.priceChanged && item.currentPrice && (
                <p className="text-sm text-green-600 mt-1">
                  Price updated: ${item.currentPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Remove Item Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveItem}
              disabled={removeFromCart.isPending}
              aria-label="Remove item from cart"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status Message */}
          {(isOutOfStock || isUnavailable) && (
            <p className="text-sm text-red-600 mt-2">
              {isUnavailable
                ? "This product is no longer available"
                : "Out of stock"}
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleUpdateQuantity(-1)}
                disabled={
                  isUpdating ||
                  item.quantity <= 1 ||
                  isOutOfStock ||
                  isUnavailable
                }
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center font-medium">
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
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
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Price Display */}
            <div className="text-right">
              <p className="font-bold">
                $
                {((item.currentPrice || item.price) * item.quantity).toFixed(2)}
              </p>
              {/* Original Price (if changed) */}
              {item.priceChanged && (
                <p className="text-sm text-gray-500 line-through">
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
