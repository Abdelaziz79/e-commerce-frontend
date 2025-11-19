// components/category/EmptyState.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderTree, Plus, Search } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onAddCategory: () => void;
}

export function EmptyState({ searchQuery, onAddCategory }: EmptyStateProps) {
  const hasSearch = !!searchQuery;

  return (
    <Card className="p-12 text-center border-0 bg-transparent">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gray-100">
            {hasSearch ? (
              <Search className="h-10 w-10 text-gray-400" />
            ) : (
              <FolderTree className="h-10 w-10 text-gray-400" />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {hasSearch ? "No results found" : "No categories yet"}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            {hasSearch
              ? "Try adjusting your search terms or checking for typos."
              : "Start building your category structure to organize your products effectively."}
          </p>
        </div>

        {!hasSearch && (
          <Button
            onClick={onAddCategory}
            className="rounded-none bg-gray-900 hover:bg-gray-800 h-10 px-6 text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Category
          </Button>
        )}
      </div>
    </Card>
  );
}
