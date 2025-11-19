// components/cart/ErrorDisplay.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorDisplay() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="p-10 max-w-md text-center border-slate-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
          <AlertCircle className="h-8 w-8 text-red-500" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We couldn&apos;t load your cart. Please check your connection and try
          again.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2 h-11 px-6"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </Card>
    </div>
  );
}
