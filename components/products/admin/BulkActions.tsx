// components/products/admin/BulkActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedIds: string[];
  onDelete: () => void;
  isMutating: boolean;
  clearSelection: () => void;
}

export function BulkActions({
  selectedIds,
  onDelete,
  isMutating,
  clearSelection,
}: BulkActionsProps) {
  const count = selectedIds.length;

  const handleDelete = () => {
    toast(`Delete ${count} products?`, {
      description: "This action is permanent and cannot be undone.",
      action: {
        label: "Delete All",
        onClick: () => onDelete(),
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      classNames: {
        actionButton: "bg-red-600 text-white",
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-none">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-none bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
          {count}
        </div>
        <span className="text-sm font-medium text-gray-900">
          {count} item{count > 1 ? "s" : ""} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isMutating}
          className="h-9 text-xs rounded-none"
        >
          {isMutating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          className="h-9 text-xs text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
