// components/cart/OrderSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartTotals, useEstimatedTotals } from "@/hooks/use-cart-totals";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Package,
  Percent,
  Shield,
  Tag,
  Truck,
} from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
  cartTotal: number;
  cartCount: number;
}

export function OrderSummary({ cartTotal, cartCount }: OrderSummaryProps) {
  // Use unified cart totals hook
  const { totals, isCalculating, error, hasValidAddress } = useCartTotals({
    autoCalculate: true,
  });

  // Get estimated totals as fallback
  const estimatedTotals = useEstimatedTotals(cartTotal);

  // Determine which totals to display
  const displayTotals = totals && hasValidAddress && !error ? totals : null;
  const showEstimated = !displayTotals;

  return (
    <div className="space-y-4">
      <Card className="p-6 border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 ">Order Summary</h2>

        <Separator className="my-6" />

        {/* Price Breakdown */}
        {isCalculating ? (
          <div className="flex items-center justify-center pb-6">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : displayTotals ? (
          // Actual calculated totals from backend
          <div className="space-y-3 pb-5 mb-5 border-b border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Subtotal ({cartCount} items)
              </span>
              <span className="font-medium text-slate-900">
                ${displayTotals.itemsPrice.toFixed(2)}
              </span>
            </div>

            {displayTotals.discount > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Discount
                    {displayTotals.discountDetails && (
                      <span className="text-xs">
                        ({displayTotals.discountDetails.code})
                      </span>
                    )}
                  </span>
                  <span className="font-medium text-green-600">
                    -${displayTotals.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">After Discount</span>
                  <span className="font-medium text-slate-900">
                    ${displayTotals.subtotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-1">
                <Truck className="h-3 w-3" />
                Shipping
                {displayTotals.shippingDetails && (
                  <span className="text-xs text-slate-500">
                    ({displayTotals.shippingDetails.rateName})
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "font-medium",
                  displayTotals.shipping === 0
                    ? "text-emerald-600"
                    : "text-slate-900"
                )}
              >
                {displayTotals.shipping === 0
                  ? "Free"
                  : `$${displayTotals.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Tax
                {displayTotals.taxDetails && (
                  <span className="text-xs text-slate-500">
                    ({displayTotals.taxDetails.rate}%)
                  </span>
                )}
              </span>
              <span className="font-medium text-slate-900">
                ${displayTotals.tax.toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          // Estimated totals (no address selected)
          <div className="space-y-3 pb-5 mb-5 border-b border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">
                Subtotal ({cartCount} items)
              </span>
              <span className="font-medium text-slate-900">
                ${estimatedTotals.itemsPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 italic">Shipping (est.)</span>
              <span className="font-medium text-slate-500 italic">
                {estimatedTotals.shipping === 0
                  ? "Free"
                  : `$${estimatedTotals.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 italic">Tax (est.)</span>
              <span className="font-medium text-slate-500 italic">
                ${estimatedTotals.tax.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-base font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">
            ${(displayTotals?.total || estimatedTotals.total).toFixed(2)}
          </span>
        </div>

        {showEstimated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Showing estimated total. Select address for accurate calculation.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full gap-2 h-12 text-base shadow-sm hover:shadow-md transition-shadow"
            asChild
            disabled={cartCount === 0}
          >
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 border-slate-300 hover:bg-slate-50"
            asChild
          >
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </Card>

      {/* Trust Badges */}
      <Card className="p-5 border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                Free Shipping
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                On orders over $50
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                Secure Payment
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Your data is protected
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">Easy Returns</p>
              <p className="text-xs text-slate-500 mt-0.5">
                30-day return policy
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
