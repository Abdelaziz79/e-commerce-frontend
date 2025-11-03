// ===== components/category/EmptyState.tsx =====
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderTree, Plus } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onAddCategory: () => void;
}

export function EmptyState({ searchQuery, onAddCategory }: EmptyStateProps) {
  const hasSearch = !!searchQuery;

  return (
    <Card className="p-12 text-center border-0 bg-muted/50">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <FolderTree className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {hasSearch ? "No Categories found" : "No Categories yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hasSearch
              ? "Try adjusting your search"
              : "Get started by creating your first category"}
          </p>
        </div>

        {!hasSearch && (
          <Button onClick={onAddCategory} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        )}
      </div>
    </Card>
  );
}
