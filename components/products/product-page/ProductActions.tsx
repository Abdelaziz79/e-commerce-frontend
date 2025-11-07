import { Button } from "@/components/ui/button";
import {
  Heart,
  Loader2,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  availableStock: number;
  onAddToCart: () => void;
  onAddToFavorites: () => void;
  isAddingToCart: boolean;
  isAddingToFavorites: boolean;
  isFavorite?: boolean;
}

export function ProductActions({
  quantity,
  setQuantity,
  availableStock,
  onAddToCart,
  onAddToFavorites,
  isAddingToCart,
  isAddingToFavorites,
  isFavorite = false,
}: ProductActionsProps) {
  const isOutOfStock = availableStock === 0;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="h-11 w-11 rounded-none hover:bg-gray-50"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="px-5 min-w-[56px] text-center">
            <span className="text-sm font-semibold text-gray-900">
              {quantity}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
            disabled={quantity >= availableStock || isOutOfStock}
            className="h-11 w-11 rounded-none hover:bg-gray-50"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock indicator */}
        {!isOutOfStock && availableStock < 10 && (
          <span className="text-xs text-orange-600 font-medium">
            Only {availableStock} left
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="flex-1 h-12 bg-gray-900 text-white hover:bg-gray-800 font-medium text-sm rounded-lg disabled:opacity-50"
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </>
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onAddToFavorites}
          disabled={isAddingToFavorites}
          className={cn(
            "h-12 w-12 rounded-lg border transition-all",
            isFavorite
              ? "border-red-500 bg-red-50 hover:bg-red-100 text-red-600"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          {isAddingToFavorites ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite && "fill-current"
              )}
            />
          )}
        </Button>
      </div>

      {/* Additional info */}
      <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5" />
          Free shipping over $50
        </span>
        <span className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          30-day returns
        </span>
      </div>
    </div>
  );
}
