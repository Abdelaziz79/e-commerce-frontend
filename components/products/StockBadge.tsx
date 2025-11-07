import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge
        variant="destructive"
        className="font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
      >
        Out of Stock
      </Badge>
    );
  }
  if (stock < 10) {
    return (
      <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5">
        Only {stock} left
      </Badge>
    );
  }
  return null;
}
