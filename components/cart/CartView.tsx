// components/cart/CartView.tsx

import { CartItem } from "@/types/cart";
import { CartHeader } from "./CartHeader";
import { CartItemList } from "./CartItemList";
import { OrderSummary } from "./OrderSummary";

interface CartViewProps {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  onClearCart: () => void;
  isClearingCart: boolean;
}

export function CartView({
  cart,
  cartCount,
  cartTotal,
  onClearCart,
  isClearingCart,
}: CartViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <CartHeader
          cartCount={cartCount}
          onClearCart={onClearCart}
          isClearingCart={isClearingCart}
          hasItems={cart.length > 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <CartItemList cart={cart} />
          </div>
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <OrderSummary cartTotal={cartTotal} cartCount={cartCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
