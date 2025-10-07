// components/favorites/FavoritesView.tsx
import { Product } from "@/types/product";
import { FavoritesGrid } from "./FavoritesGrid";
import { FavoritesHeader } from "./FavoritesHeader";
import { Pagination } from "./Pagination";
// A reusable pagination component

interface FavoritesViewProps {
  favorites: Product[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export function FavoritesView({
  favorites,
  totalPages,
  totalItems,
  currentPage,
  onPageChange,
  currentSort,
  onSortChange,
}: FavoritesViewProps) {
  return (
    <>
      <FavoritesHeader
        totalItems={totalItems}
        currentSort={currentSort}
        onSortChange={onSortChange}
      />
      <FavoritesGrid favorites={favorites} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
