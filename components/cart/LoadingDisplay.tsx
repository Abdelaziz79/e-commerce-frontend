// components/cart/LoadingDisplay.tsx
import { Loader2 } from "lucide-react";

export function LoadingDisplay() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative inline-flex">
          <Loader2
            className="h-12 w-12 animate-spin text-slate-300"
            strokeWidth={2}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-500 text-base font-medium">
          Loading your cart...
        </p>
      </div>
    </div>
  );
}
