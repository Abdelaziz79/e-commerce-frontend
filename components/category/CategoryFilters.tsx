// components/category/CategoryFilters.tsx
import { Search, Grid3x3, List, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CategoryStatusFilter } from "./hooks/useCategoryFilters";
import { useRef } from "react";

type ViewMode = "grid" | "list";

interface CategoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  statusFilter: CategoryStatusFilter;
  setStatusFilter: (status: CategoryStatusFilter) => void;
  onAddCategory: () => void;
  isSearchMode?: boolean;
}

export function CategoryFilters({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
  onAddCategory,
  isSearchMode = false,
}: CategoryFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    setSearchQuery("");
    // Keep focus on input after clearing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-10 w-full"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter Dropdown - Disabled in search mode */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            disabled={isSearchMode}
          >
            <SelectTrigger className="h-10 w-full md:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-10 w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest</SelectItem>
              <SelectItem value="createdAt">Oldest</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="-name">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggles */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-10 w-10 shrink-0"
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-10 w-10 shrink-0"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Category Button */}
          <Button onClick={onAddCategory} className="h-10 hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Add category button for mobile */}
        <Button onClick={onAddCategory} className="h-10 w-full sm:hidden">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search Mode Indicator */}
      {isSearchMode && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Search className="h-3 w-3" />
            Searching: &quot;{searchQuery}&quot;
          </Badge>
          <p className="text-sm text-muted-foreground">
            Status filter is disabled in search mode.
          </p>
        </div>
      )}
    </div>
  );
}
