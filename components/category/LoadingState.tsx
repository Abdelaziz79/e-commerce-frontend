// components/category/LoadingState.tsx
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="relative mx-auto">
          <div className="absolute inset-0 bg-gray-900 rounded-full opacity-10 animate-ping" />
          <div className="relative bg-white p-4 rounded-full shadow-sm border border-gray-200">
            <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Loading categories...
        </p>
        <p className="text-xs text-gray-500">
          Please wait while we fetch your data
        </p>
      </div>
    </div>
  );
}
