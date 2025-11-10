// components/products/edit/FormActions.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Loader2, X, Save } from "lucide-react";
import Link from "next/link";

interface FormActionsProps {
  isPending: boolean;
  productId: string;
}

export function FormActions({ isPending, productId }: FormActionsProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <Button
        asChild
        type="button"
        variant="outline"
        size="default"
        className="min-w-[120px] text-sm h-9 border-gray-200 rounded-none"
        disabled={isPending}
      >
        <Link href={`/admin/products`}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <Button
          asChild
          type="button"
          variant="outline"
          size="default"
          className="min-w-[140px] text-sm h-9 border-gray-200 rounded-none"
          disabled={isPending}
        >
          <Link href="/admin/products">Back to List</Link>
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          size="default"
          className="min-w-[180px] text-sm h-9 rounded-none"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
