// components/brand/user/EmptyBrands.tsx
import { Store, Search } from "lucide-react";

interface EmptyBrandsProps {
  searchQuery: string;
}

export function EmptyBrands({ searchQuery }: EmptyBrandsProps) {
  const hasSearch = !!searchQuery;

  return (
    <div className="m-4 flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-gray-200 rounded-none">
      <div className="relative mb-6">
        <div className="relative bg-gray-50 rounded-none p-6 sm:p-8 border border-gray-200">
          {hasSearch ? (
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          ) : (
            <Store className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          )}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
        {hasSearch ? "No brands found" : "No brands available"}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 text-center max-w-md leading-relaxed px-4">
        {hasSearch
          ? "We couldn't find any brands matching your search."
          : "Brands will appear here once they are added."}
      </p>
    </div>
  );
}
