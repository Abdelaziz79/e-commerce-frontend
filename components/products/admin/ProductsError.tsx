// components/products/admin/ProductsError.tsx
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ApiError } from "@/types/auth";

interface ProductsErrorProps {
  error: ApiError | Error | null;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function ProductsError({
  error,
  onRetry,
  onClearFilters,
}: ProductsErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center border-t border-gray-100">
      <div className="bg-red-50 rounded-full p-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          Failed to load products
        </h3>
        <p className="text-sm text-gray-600 max-w-sm mt-2">
          {error instanceof Error
            ? error.message
            : "An unknown error occurred."}{" "}
          Please try clearing your filters or refreshing the data.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="rounded-lg"
        >
          Clear Filters
        </Button>
        <Button onClick={onRetry} className="rounded-lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}
