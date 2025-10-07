// components/favorites/FavoritesHeader.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FavoritesHeaderProps {
  totalItems: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
}

export function FavoritesHeader({
  totalItems,
  currentSort,
  onSortChange,
}: FavoritesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <p className="text-gray-600 mt-1">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>
      </div>

      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-createdAt">Newest First</SelectItem>
          <SelectItem value="createdAt">Oldest First</SelectItem>
          <SelectItem value="name">Name: A-Z</SelectItem>
          <SelectItem value="-name">Name: Z-A</SelectItem>
          <SelectItem value="price">Price: Low to High</SelectItem>
          <SelectItem value="-price">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
