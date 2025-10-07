"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface FormActionsProps {
  isPending: boolean;
}

export function FormActions({ isPending }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-8 pb-8">
      <Link href="/admin/products">
        <Button type="button" variant="outline" size="lg">
          Cancel
        </Button>
      </Link>
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="min-w-[150px]"
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Product
      </Button>
    </div>
  );
}
