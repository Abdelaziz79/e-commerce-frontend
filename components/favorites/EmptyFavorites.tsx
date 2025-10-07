// components/favorites/EmptyFavorites.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";

export function EmptyFavorites() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="p-12 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">
          Start adding products you love to your wishlist!
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </Card>
    </div>
  );
}
