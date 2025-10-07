// src/components/products/product-page/ProductActions.tsx
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";

interface ProductActionsProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  availableStock: number;
  onAddToCart: () => void;
  onAddToFavorites: () => void;
  isAddingToCart: boolean;
  isAddingToFavorites: boolean;
}

export function ProductActions({
  quantity,
  setQuantity,
  availableStock,
  onAddToCart,
  onAddToFavorites,
  isAddingToCart,
  isAddingToFavorites,
}: ProductActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-3 rounded-full h-auto"
        >
          -
        </Button>
        <span className="px-6 py-3 border-x border-gray-300 font-medium">
          {quantity}
        </span>
        <Button
          variant="ghost"
          onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
          className="px-4 py-3 rounded-full h-auto"
        >
          +
        </Button>
      </div>
      <Button
        size="lg"
        onClick={onAddToCart}
        disabled={availableStock === 0 || isAddingToCart}
        className="w-full sm:w-auto flex-1 bg-black text-white hover:bg-gray-800 rounded-full h-12 text-base"
      >
        {isAddingToCart ? <Loader2 className="animate-spin" /> : "Add to Cart"}
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={onAddToFavorites}
        disabled={isAddingToFavorites}
        className="rounded-full w-12 h-12 border-gray-300 group"
      >
        <Heart className="h-5 w-5 text-gray-600 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
      </Button>
    </div>
  );
}
