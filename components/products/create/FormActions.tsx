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
    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
      <Button
        asChild
        type="button"
        variant="outline"
        size="default"
        className="min-w-[120px] text-sm h-9 border-gray-200 rounded-none"
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
        size="default"
        className="min-w-[180px] text-sm h-9 rounded-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Create Product
          </>
        )}
      </Button>
    </div>
  );
}
