"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingFilterProps {
  selectedRating: number | null;
  handleRatingFilter: (rating: number) => void;
}

export function RatingFilter({
  selectedRating,
  handleRatingFilter,
}: RatingFilterProps) {
  return (
    <div className="space-y-2">
      {[4, 3, 2, 1].map((rating) => (
        <button
          key={rating}
          onClick={() => handleRatingFilter(rating)}
          className={cn(
            "w-full px-2 py-2.5  text-sm font-medium transition-all duration-200 flex items-center justify-between group cursor-pointer border-b border-gray-50 last:border-0",
            selectedRating === rating
              ? "bg-gray-900 text-white shadow-sm"
              : "hover:bg-gray-50 text-gray-700"
          )}
        >
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4 transition-colors",
                  i < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span
            className={cn(
              "text-xs font-semibold",
              selectedRating === rating ? "text-gray-300" : "text-gray-500"
            )}
          >
            & Up
          </span>
        </button>
      ))}
    </div>
  );
}
