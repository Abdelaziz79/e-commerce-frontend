// components/ui/FormActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FormActionsProps {
  isPending: boolean;
  submitText: string;
  pendingText: string;
  submitIcon: React.ReactNode;
  cancelHref: string;
  justify?: "start" | "end" | "between";
  children?: React.ReactNode;
}

export function FormActions({
  isPending,
  submitText,
  pendingText,
  submitIcon,
  cancelHref,
  justify = "end",
  children,
}: FormActionsProps) {
  const justifyContentClass = {
    start: "justify-start",
    end: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={`flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 ${justifyContentClass[justify]}`}
    >
      <div className="flex items-center gap-3">
        <Button
          asChild
          type="button"
          variant="outline"
          size="default"
          className="min-w-[120px] text-sm h-9 border-gray-200 rounded-none"
          disabled={isPending}
        >
          <Link href={cancelHref}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
        </Button>
        {children}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        size="default"
        className="min-w-[180px] text-sm h-9 rounded-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {pendingText}
          </>
        ) : (
          <>
            {submitIcon}
            {submitText}
          </>
        )}
      </Button>
    </div>
  );
}
