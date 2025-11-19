// components/cart/CartPage.tsx
"use client";

import { toast } from "sonner";
import {
  useCart,
  useCartCount,
  useCartTotal,
  useClearCart,
} from "@/hooks/use-cart-favorites";
import { CartView } from "./CartView";
import { EmptyCart } from "./EmptyCart";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoadingDisplay } from "./LoadingDisplay";

export default function CartPage() {
  const { data: cartData, isLoading, error } = useCart();
  const cartCount = useCartCount();
  const cartTotal = useCartTotal();
  const clearCart = useClearCart();

  const handleClearCart = () => {
    toast("Are you sure you want to clear your cart?", {
      action: {
        label: "Clear",
        onClick: () => {
          clearCart.mutate(undefined, {
            onSuccess: () => {
              toast.success("Cart cleared successfully");
            },
            onError: () => {
              toast.error("Failed to clear cart");
            },
          });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay />;
  }

  const cart = cartData?.data?.cart || [];

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <CartView
      cart={cart}
      cartCount={cartCount}
      cartTotal={cartTotal}
      onClearCart={handleClearCart}
      isClearingCart={clearCart.isPending}
    />
  );
}
