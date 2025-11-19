// components/checkout/OrderSummaryCard.tsx
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import { Package, Truck, Receipt, Lock } from "lucide-react";

interface OrderSummaryCardProps {
  cart: CartItem[];
  cartTotal: number;
  shippingAddress: ShippingAddress | null;
}

export function OrderSummaryCard({
  cart,
  cartTotal,
  shippingAddress,
}: OrderSummaryCardProps) {
  const itemsPrice = cartTotal;
  const shippingPrice = shippingAddress && itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.1;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + (shippingPrice || 0) + taxPrice;

  return (
    <div className="sticky top-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
        Order Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Package className="h-4 w-4" />
            <span>Subtotal ({cart.length} items)</span>
          </div>
          <span className="font-semibold text-slate-900">
            ${itemsPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Truck className="h-4 w-4" />
            <span>Shipping</span>
          </div>
          {shippingAddress && shippingPrice === 0 ? (
            <span className="font-semibold text-emerald-600">FREE</span>
          ) : (
            <span className="font-semibold text-slate-900">
              ${(shippingPrice || 10).toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Receipt className="h-4 w-4" />
            <span>Tax (10%)</span>
          </div>
          <span className="font-semibold text-slate-900">
            ${taxPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 mb-6">
        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {!shippingAddress && itemsPrice < 100 && (
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span>Free shipping progress</span>
              <span>${itemsPrice.toFixed(2)} / $100.00</span>
            </div>
            <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min((itemsPrice / 100) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-emerald-600">
              Add ${(100 - itemsPrice).toFixed(2)} more for free shipping
            </p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <span>Secure checkout powered by SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
