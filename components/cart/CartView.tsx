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
    <>
      <CartHeader
        cartCount={cartCount}
        onClearCart={onClearCart}
        isClearingCart={isClearingCart}
        hasItems={cart.length > 0}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CartItemList cart={cart} />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary cartTotal={cartTotal} />
        </div>
      </div>
    </>
  );
}
