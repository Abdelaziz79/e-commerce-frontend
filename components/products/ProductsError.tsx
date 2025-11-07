import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

type Props = {
  onResetFilters?: () => void;
  onRetry?: () => void;
  handleResetFilters?: () => void;
};

function ProductsError({ onResetFilters, onRetry, handleResetFilters }: Props) {
  return (
    <div className="m-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="bg-white rounded-full p-3 sm:p-4 shadow-lg mb-3 sm:mb-4">
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-600" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-md px-4">
          We couldn&apos;t load the products. Please check your connection and
          try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-0">
          {onResetFilters && (
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="font-semibold w-full sm:w-auto"
            >
              Reset Filters
            </Button>
          )}
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsError;
