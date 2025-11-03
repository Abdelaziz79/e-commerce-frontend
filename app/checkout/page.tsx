// app/checkout/page.tsx
"use client";

import { CheckoutView } from "@/components/checkout/CheckoutView";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { useCart, useCartTotal } from "@/hooks/use-cart-favorites";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, isLoading } = useCart();
  const cartTotal = useCartTotal();

  const cart = cartData?.data?.cart || [];

  useEffect(() => {
    // Redirect if cart is empty (after loading)
    if (!isLoading && cart.length === 0) {
      router.push("/cart");
    }
  }, [cart.length, isLoading, router]);

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return <CheckoutView cart={cart} cartTotal={cartTotal} />;
}
