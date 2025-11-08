// app/admin/products/create/components/FormActions.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Check } from "lucide-react";
import Link from "next/link";

interface FormActionsProps {
  isPending: boolean;
}

export function FormActions({ isPending }: FormActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-10 pt-6 pb-6 bg-gradient-to-t from-gray-50 to-transparent">
      <div className="flex items-center justify-between gap-4 p-5 bg-white rounded-xl border-2 border-gray-200 shadow-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Ready to publish?</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Review your product details before creating
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            type="button"
            variant="outline"
            size="lg"
            className="min-w-[120px] border-gray-300"
            disabled={isPending}
          >
            <Link href="/admin/products">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="min-w-[180px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Create Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
