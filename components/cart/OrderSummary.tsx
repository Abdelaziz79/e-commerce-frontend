// components/cart/OrderSummary.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Package, Shield, Truck } from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
  cartTotal: number;
  cartCount: number;
}

export function OrderSummary({ cartTotal, cartCount }: OrderSummaryProps) {
  const shipping = 0; // Free shipping
  const tax = cartTotal * 0.1; // 10% tax estimate
  const total = cartTotal + shipping + tax;

  return (
    <div className="space-y-4">
      <Card className="p-6 border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div className="space-y-3 pb-5 mb-5 border-b border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal ({cartCount} items)</span>
            <span className="font-medium text-slate-900">
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Shipping</span>
            <span className="font-medium text-emerald-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tax (estimate)</span>
            <span className="font-medium text-slate-900">
              ${tax.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline mb-6">
          <span className="text-base font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full gap-2 h-12 text-base shadow-sm hover:shadow-md transition-shadow"
            asChild
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
