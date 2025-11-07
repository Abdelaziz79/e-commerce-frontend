"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Loader2, Search } from "lucide-react";

interface Item {
  _id: string;
  name: string;
}

interface FilterableListProps<T extends Item> {
  items: T[];
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
  isLoading: boolean;
  isSearching: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  searchPlaceholder: string;
  noItemsText: string;
  noSearchResultsText: string;
}

export function FilterableList<T extends Item>({
  items,
  selectedItem,
  onSelectItem,
  isLoading,
  isSearching,
  searchValue,
  onSearchChange,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  searchPlaceholder,
  noItemsText,
  noSearchResultsText,
}: FilterableListProps<T>) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 text-sm bg-gray-50 border-gray-200 focus:bg-white rounded-none"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>
      <div className="max-h-60 overflow-y-auto pr-2 -mr-2">
        <div className="space-y-1">
          {items.length > 0 ? (
            <>
              {items.map((item) => {
                const isSelected = selectedItem === item._id;
                return (
                  <button
                    key={item._id}
                    onClick={() => onSelectItem(item._id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer border-b border-gray-50 last:border-0 rounded",
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-4 h-4 border-2 rounded flex items-center justify-center transition-all",
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <span className="flex-1 text-left">{item.name}</span>
                  </button>
                );
              })}
              {hasNextPage && fetchNextPage && (
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="ghost"
                  className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              {isLoading
                ? "Loading..."
                : searchValue
                ? noSearchResultsText
                : noItemsText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
