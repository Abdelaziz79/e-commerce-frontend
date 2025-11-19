// components/brand/user/BrandSearchBar.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, ArrowUpDown } from "lucide-react";
import { useRef } from "react";

interface BrandSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  isSearchMode: boolean;
  debouncedSearch: string;
}

const sortOptions = [
  { value: "name", label: "Name: A-Z" },
  { value: "-name", label: "Name: Z-A" },
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
];

export function BrandSearchBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  isSearchMode,
  debouncedSearch,
}: BrandSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    setSearchQuery("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort by";

  return (
    <div className="px-4 sm:px-6 mb-4 sm:mb-6 space-y-4">
      {/* Search & Sort Row */}
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

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 w-[160px] border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 bg-white shadow-sm transition-all">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
                <SelectValue>
                  <span className="font-medium text-gray-900">
                    {currentLabel}
                  </span>
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-lg">
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm rounded-lg"
                >
                  {option.label}
                </SelectItem>
              ))}
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
              Searching: &quot;{debouncedSearch}&quot;
            </span>
          </Badge>
        </div>
      )}
    </div>
  );
}
