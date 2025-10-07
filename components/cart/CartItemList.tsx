// components/cart/CartItemList.tsx

import { CartItem } from "@/types/cart";
import { CartItemCard } from "./CartItemCard";

interface CartItemListProps {
  cart: CartItem[];
}

export function CartItemList({ cart }: CartItemListProps) {
  return (
    <>
      {cart.map((item, index) => (
        <CartItemCard
          key={`${index}-${item.variation?.sku || ""}`}
          item={item}
        />
      ))}
    </>
  );
}
