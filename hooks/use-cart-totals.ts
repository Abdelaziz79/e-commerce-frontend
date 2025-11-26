// hooks/use-cart-totals.ts
import { CartTotalsData } from "@/types/cart";
import { useEffect, useState, useCallback } from "react";
import { useCalculateCartTotals, useCart } from "./use-cart-favorites";
import { useUserProfile } from "./use-user-mutations";
import { toast } from "sonner";

interface UseCartTotalsOptions {
  shippingAddressId?: string;
  discountCode?: string;
  autoCalculate?: boolean;
  onDiscountError?: () => void; // NEW: Callback to clear discount on error
}

interface UseCartTotalsReturn {
  totals: CartTotalsData | null;
  isCalculating: boolean;
  error: Error | null;
  calculate: () => void;
  hasValidAddress: boolean;
  reset: () => void;
  discountError: string | null; // NEW: Specific discount error
}

export function useCartTotals(
  options: UseCartTotalsOptions = {}
): UseCartTotalsReturn {
  const {
    shippingAddressId,
    discountCode,
    autoCalculate = true,
    onDiscountError,
  } = options;

  const { data: profileData } = useUserProfile();
  const { data: cartData } = useCart();
  const user = profileData?.data;

  const {
    mutate: calculateTotals,
    data: totalsResponse,
    isPending,
    error,
    reset: resetMutation,
  } = useCalculateCartTotals();

  const [totals, setTotals] = useState<CartTotalsData | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [lastCalculation, setLastCalculation] = useState<{
    addressId: string;
    discountCode: string;
    cartTotal: number;
  } | null>(null);

  // Get selected address
  const selectedAddress = user?.addresses?.find(
    (addr) => addr._id === shippingAddressId
  );
  const defaultAddress = user?.addresses?.find((addr) => addr.isDefault);
  const address = selectedAddress || defaultAddress;

  const hasValidAddress = !!address;

  // Get cart data to watch for changes
  const cartTotal = cartData?.data?.cartTotal || 0;
  const cartCount = cartData?.data?.cartCount || 0;

  // Calculate totals function
  const calculate = useCallback(() => {
    if (!address) {
      console.warn("Cannot calculate totals: No address provided");
      return;
    }

    if (cartTotal === 0) {
      console.warn("Cannot calculate totals: Cart is empty");
      return;
    }

    // Check if we need to recalculate
    const currentState = {
      addressId: shippingAddressId || "",
      discountCode: discountCode || "",
      cartTotal,
    };

    // Skip if nothing changed
    if (
      lastCalculation &&
      lastCalculation.addressId === currentState.addressId &&
      lastCalculation.discountCode === currentState.discountCode &&
      lastCalculation.cartTotal === currentState.cartTotal
    ) {
      return;
    }

    setLastCalculation(currentState);
    setDiscountError(null); // Clear previous discount errors

    calculateTotals(
      {
        shippingAddress: {
          address: address.address,
          city: address.city,
          state: address.country,
          postalCode: address.postalCode,
          country: address.country,
        },
        discountCode: discountCode || undefined,
      },
      {
        onError: (error) => {
          console.error("Totals calculation error:", error);

          // Check if it's a discount-specific error
          if (error?.message && error.message.includes("discount")) {
            setDiscountError(error.message);
            toast.error(error.message, {
              duration: 4000,
              id: "discount-error",
            });
          } else if (error?.message) {
            toast.error("Failed to calculate totals. Please try again.");
          }
        },
      }
    );
  }, [
    address,
    shippingAddressId,
    discountCode,
    cartTotal,
    calculateTotals,
    lastCalculation,
  ]);

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (autoCalculate && address && cartTotal > 0) {
      const timeoutId = setTimeout(() => {
        calculate();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [autoCalculate, address?.address, cartTotal, cartCount, calculate]);

  // Update totals when response changes
  useEffect(() => {
    if (totalsResponse?.data) {
      // Check for discount error in response
      if (totalsResponse.data.error) {
        const errorMsg = totalsResponse.data.error;
        setDiscountError(errorMsg);

        // Show error toast for invalid discount
        toast.error(errorMsg, {
          duration: 5000,
          id: "discount-error",
        });

        // Clear the discount code to trigger recalculation without it
        if (onDiscountError) {
          onDiscountError();
        }

        // Don't set these error totals - wait for recalculation
        return;
      } else {
        setDiscountError(null);
        setTotals(totalsResponse.data);
      }
    }
  }, [totalsResponse, onDiscountError]);

  const reset = useCallback(() => {
    setTotals(null);
    setLastCalculation(null);
    setDiscountError(null);
    resetMutation();
  }, [resetMutation]);

  return {
    totals,
    isCalculating: isPending,
    error: error as Error | null,
    calculate,
    hasValidAddress,
    reset,
    discountError, // NEW: Return discount-specific error
  };
}

/**
 * Hook to get estimated totals (fallback when no address selected)
 */
export function useEstimatedTotals(cartTotal: number) {
  const estimatedTax = cartTotal * 0.08; // 8% estimate
  const estimatedShipping = cartTotal >= 100 ? 0 : 10;
  const estimatedTotal = cartTotal + estimatedTax + estimatedShipping;

  return {
    itemsPrice: cartTotal,
    subtotal: cartTotal,
    tax: estimatedTax,
    shipping: estimatedShipping,
    discount: 0,
    total: estimatedTotal,
    isEstimate: true,
    breakdown: {
      "Items Total": cartTotal,
      "After Discount": cartTotal,
      Tax: estimatedTax,
      Shipping: estimatedShipping,
      "Final Total": estimatedTotal,
    },
  };
}

/**
 * Hook to check if free shipping threshold is met
 */
export function useFreeShippingProgress(cartTotal: number, threshold = 100) {
  const remaining = Math.max(0, threshold - cartTotal);
  const progress = Math.min((cartTotal / threshold) * 100, 100);
  const qualifiesForFreeShipping = cartTotal >= threshold;

  return {
    remaining,
    progress,
    qualifiesForFreeShipping,
    threshold,
  };
}
