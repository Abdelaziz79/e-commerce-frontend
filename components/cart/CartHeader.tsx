// components/cart/CartHeader.tsx
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface CartHeaderProps {
  cartCount: number;
  onClearCart: () => void;
  isClearingCart: boolean;
  hasItems: boolean;
}

export function CartHeader({
  cartCount,
  onClearCart,
  isClearingCart,
  hasItems,
}: CartHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Shopping Cart ({cartCount})</h1>
      {hasItems && (
        <Button
          variant="outline"
          onClick={onClearCart}
          disabled={isClearingCart}
        >
          {isClearingCart ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Clear Cart
        </Button>
      )}
    </div>
  );
}
