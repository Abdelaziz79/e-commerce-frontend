// components/brand/BrandFilters.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Filter, Grid3x3, List, Search, X } from "lucide-react";
import { useRef, useEffect } from "react";
import { BrandStatusFilter } from "./hooks/useBrandFilters";
import { ViewModeStorage } from "@/lib/brandViewModeStorage";

type ViewMode = "grid" | "list";

interface BrandFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  statusFilter: BrandStatusFilter;
  setStatusFilter: (status: BrandStatusFilter) => void;
  onAddBrand: () => void;
  isSearchMode?: boolean;
}

export function BrandFilters({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
  onAddBrand,
  isSearchMode = false,
}: BrandFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const viewModeStorage = ViewModeStorage.getInstance();

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = viewModeStorage.get();
    if (savedViewMode !== viewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    viewModeStorage.set(mode);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search brands by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-10 h-11 w-full border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 bg-white shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all"
              aria-label="Clear search"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange("grid")}
              className={`h-10 w-10 rounded-none transition-all ${
                viewMode === "grid"
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-5 bg-gray-200" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange("list")}
              className={`h-10 w-10 rounded-none transition-all ${
                viewMode === "list"
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            disabled={isSearchMode}
          >
            <SelectTrigger className="h-10 w-[160px] border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-gray-500" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              <SelectItem value="all" className="text-sm rounded-lg">
                All Statuses
              </SelectItem>
              <SelectItem value="active" className="text-sm rounded-lg">
                Active Only
              </SelectItem>
              <SelectItem value="inactive" className="text-sm rounded-lg">
                Inactive Only
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-10 w-[160px] border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 bg-white shadow-sm transition-all">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              <SelectItem value="-createdAt" className="text-sm rounded-lg">
                Newest First
              </SelectItem>
              <SelectItem value="createdAt" className="text-sm rounded-lg">
                Oldest First
              </SelectItem>
              <SelectItem value="name" className="text-sm rounded-lg">
                Name A-Z
              </SelectItem>
              <SelectItem value="-name" className="text-sm rounded-lg">
                Name Z-A
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Mode Indicator */}
      {isSearchMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-1">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200 rounded-lg shadow-sm"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              Searching: &quot;{searchQuery}&quot;
            </span>
          </Badge>
          <p className="text-xs text-gray-500">
            Status filter is disabled in search mode
          </p>
        </div>
      )}
    </div>
  );
}
