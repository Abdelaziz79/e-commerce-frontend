import { PackageX } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type Props = {
  onResetFilters?: () => void;
  handleResetFilters?: () => void;
};

function EmptyProducts({ onResetFilters, handleResetFilters }: Props) {
  return (
    <div className="m-4 flex flex-col items-center justify-center py-20 sm:py-32 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm">
      <div className=" relative mb-4 sm:mb-6">
        <div className=" absolute inset-0 bg-gray-300 rounded-full opacity-20 animate-pulse" />
        <div className=" relative bg-white rounded-full p-4 sm:p-6 shadow-lg">
          <PackageX className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        No products found
      </h3>
      <p className="text-sm sm:text-base text-gray-600 text-center max-w-md mb-4 sm:mb-6 leading-relaxed px-4">
        We couldn&apos;t find any products matching your current filters. Try
        adjusting your search criteria or browse our featured collections.
      </p>
      <div className="flex gap-3 px-4 sm:px-0 w-full sm:w-auto">
        {onResetFilters && (
          <Button
            onClick={handleResetFilters}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold flex-1 sm:flex-initial"
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyProducts;
