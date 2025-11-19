// components/category/user/EmptyCategories.tsx
import { FolderTree, Search } from "lucide-react";

interface EmptyCategoriesProps {
  searchQuery: string;
}

export function EmptyCategories({ searchQuery }: EmptyCategoriesProps) {
  const hasSearch = !!searchQuery;

  return (
    <div className="m-4 flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-gray-200 rounded-none">
      <div className="relative mb-6">
        <div className="relative bg-gray-50 rounded-none p-6 sm:p-8 border border-gray-200">
          {hasSearch ? (
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          ) : (
            <FolderTree className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          )}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
        {hasSearch ? "No categories found" : "No categories available"}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 text-center max-w-md leading-relaxed px-4">
        {hasSearch
          ? "We couldn't find any categories matching your search."
          : "Categories will appear here once they are added."}
      </p>
    </div>
  );
}
