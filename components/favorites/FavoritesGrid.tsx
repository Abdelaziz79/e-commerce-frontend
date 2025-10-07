// components/favorites/FavoritesGrid.tsx
import { Product } from "@/types/product";
import { FavoriteProductCard } from "./FavoriteProductCard";

interface FavoritesGridProps {
  favorites: Product[];
}

export function FavoritesGrid({ favorites }: FavoritesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {favorites.map((product) => (
        <FavoriteProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
