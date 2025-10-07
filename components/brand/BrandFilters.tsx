// ===== components/brand/BrandFilters.tsx =====
import { Search, Grid3x3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ViewMode = "grid" | "list";

interface BrandFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddBrand: () => void;
}

export function BrandFilters({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddBrand,
}: BrandFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className="h-10 w-10"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
          className="h-10 w-10"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={onAddBrand} className="h-10">
        <Plus className="h-4 w-4 mr-2" />
        Add Brand
      </Button>
    </div>
  );
}
