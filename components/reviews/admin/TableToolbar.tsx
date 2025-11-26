// components/reviews/admin/TableToolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewsParams } from "@/types/review";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  params: ReviewsParams;
  onFilterChange: (filters: Partial<ReviewsParams>) => void;
  onClearFilters: () => void;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  params,
  onFilterChange,
  onClearFilters,
}: TableToolbarProps) {
  const hasActiveFilters = !!searchQuery;

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews, products, users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-10 pr-10 text-sm border-gray-200 rounded-none focus:ring-1 focus:ring-gray-900"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Filter */}
        <Select
          value={params.sort || "-createdAt"}
          onValueChange={(val) => onFilterChange({ sort: val })}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm border-gray-200 rounded-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-createdAt">Newest First</SelectItem>
            <SelectItem value="createdAt">Oldest First</SelectItem>
            <SelectItem value="-rating">Highest Rating</SelectItem>
            <SelectItem value="rating">Lowest Rating</SelectItem>
            <SelectItem value="-helpfulVotes">Most Helpful</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
