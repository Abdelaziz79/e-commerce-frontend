import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterHeaderProps {
  activeFilterCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterHeader({
  activeFilterCount,
  hasActiveFilters,
  onReset,
}: FilterHeaderProps) {
  return (
    <div className="px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-white">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 -mr-2"
          >
            Clear all
          </Button>
        )}
      </div>
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 h-5 px-2 text-xs font-semibold">
            {activeFilterCount} active
          </Badge>
        </div>
      )}
    </div>
  );
}
