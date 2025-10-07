// ===== components/CategoryFilters.tsx =====
import { Search, Grid3x3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ViewMode = "grid" | "list";
type FilterType = "all" | "active" | "inactive" | "parent" | "child";

interface CategoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddCategory: () => void;
}

export function CategoryFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  viewMode,
  setViewMode,
  onAddCategory,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      <Select
        value={filterType}
        onValueChange={(v) => setFilterType(v as FilterType)}
      >
        <SelectTrigger className="w-full sm:w-[160px] h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="parent">Parents</SelectItem>
          <SelectItem value="child">Children</SelectItem>
        </SelectContent>
      </Select>

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

      <Button onClick={onAddCategory} className="h-10">
        <Plus className="h-4 w-4 mr-2" />
        Add Category
      </Button>
    </div>
  );
}
