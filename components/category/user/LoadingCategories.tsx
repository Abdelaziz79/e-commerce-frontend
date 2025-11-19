// components/category/user/LoadingCategories.tsx
import { Loader2 } from "lucide-react";

export function LoadingCategories() {
  return (
    <div className="m-4 flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-gray-200 rounded-none">
      <div className="relative mb-6">
        <div className="relative bg-gray-50 rounded-none p-4 sm:p-5 border border-gray-200">
          <Loader2 className="w-10 h-10 sm:w-14 sm:h-14 animate-spin text-gray-900" />
        </div>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
        Loading categories...
      </h3>
      <p className="text-sm text-gray-600">Please wait</p>
    </div>
  );
}
