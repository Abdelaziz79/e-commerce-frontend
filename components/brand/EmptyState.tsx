// ===== components/brand/EmptyState.tsx =====
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  searchQuery: string;
  onAddBrand: () => void;
}

export function EmptyState({ searchQuery, onAddBrand }: EmptyStateProps) {
  const hasSearch = !!searchQuery;

  return (
    <Card className="p-12 text-center border-0 bg-muted/50">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {hasSearch ? "No brands found" : "No brands yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hasSearch
              ? "Try adjusting your search"
              : "Get started by creating your first brand"}
          </p>
        </div>

        {!hasSearch && (
          <Button onClick={onAddBrand} className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Create Brand
          </Button>
        )}
      </div>
    </Card>
  );
}
