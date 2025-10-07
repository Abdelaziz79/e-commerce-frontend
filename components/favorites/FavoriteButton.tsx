// components/favorites/FavoriteButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useToggleFavorite, useIsFavorite } from "@/hooks/use-cart-favorites";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
  className?: string;
}

export default function FavoriteButton({
  productId,
  variant = "ghost",
  size = "icon",
  showText = false,
  className,
}: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(productId);
  const { toggle, isLoading } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a Link
    e.stopPropagation(); // Prevent event bubbling
    toggle(productId, isFavorite);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isFavorite && "text-red-500 hover:text-red-600",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      )}
      {showText && (
        <span className="ml-2">
          {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
}
