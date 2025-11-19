// components/brand/ErrorState.tsx

import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="p-12 text-center max-w-md border-0 bg-transparent">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-50">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {error.message ||
              "An unexpected error occurred while loading brands."}
          </p>
        </div>

        {onRetry && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={onRetry}
              className="rounded-none border-gray-200 hover:bg-gray-50 h-9 px-4 text-sm"
            >
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
