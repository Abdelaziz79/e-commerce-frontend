// components/cart/CartPage.tsx
"use client";

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
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart.mutate();
    }
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
    <div className="container mx-auto px-4 py-8">
      <CartView
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClearCart={handleClearCart}
        isClearingCart={clearCart.isPending}
      />
    </div>
  );
}
