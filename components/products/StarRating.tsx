import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3 sm:h-3.5 sm:w-3.5 transition-colors",
              i < Math.floor(rating)
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
      <span className="text-[10px] sm:text-xs text-gray-400">
        ({reviewCount})
      </span>
    </div>
  );
}
