import { Loader2 } from "lucide-react";
import React from "react";

function LoadingProducts() {
  return (
    <div className="m-4 flex flex-col items-center justify-center py-20 sm:py-32 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm ">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping" />
        <div className="relative bg-white rounded-full p-3 sm:p-4 shadow-lg">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-blue-600" />
        </div>
      </div>
      <p className="text-gray-900 font-semibold text-base sm:text-lg mt-4 sm:mt-6">
        Loading products...
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center px-4">
        Please wait while we fetch the latest items
      </p>
    </div>
  );
}

export default LoadingProducts;
