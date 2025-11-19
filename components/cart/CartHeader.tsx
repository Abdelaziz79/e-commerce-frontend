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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Shopping Cart
        </h1>
        <p className="text-slate-500 mt-2 text-base">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </p>
      </div>

      {hasItems && (
        <Button
          variant="outline"
          onClick={onClearCart}
          disabled={isClearingCart}
          className="gap-2 h-11 px-5 border-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          {isClearingCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Clear Cart
        </Button>
      )}
    </div>
  );
}
