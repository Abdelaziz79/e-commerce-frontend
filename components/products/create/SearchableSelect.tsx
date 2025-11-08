// app/admin/products/create/components/SearchableSelect.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface Item {
  _id: string;
  name: string;
}

type UseSearchableInfiniteQueryHook = (
  searchTerm: string,
  selectedId: string | null
) => {
  items: Item[];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isLoading: boolean;
};

interface SearchableSelectProps {
  value: string | null;
  onValueChange: (value: string) => void;
  useSearchableInfiniteQuery: UseSearchableInfiniteQueryHook;
  placeholder?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  useSearchableInfiniteQuery,
  placeholder = "Select an item...",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { items, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchableInfiniteQuery(search, value);

  const selectedItemName = useMemo(() => {
    return items.find((item) => item._id === value)?.name;
  }, [items, value]);

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-left h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span
            className={selectedItemName ? "text-gray-900" : "text-gray-500"}
          >
            {selectedItemName || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-lg border-gray-200">
        <div className="p-3 border-b bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
            />
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-1.5">
            {isLoading && !isFetchingNextPage ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Loading...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  No results found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search
                </p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => {
                      onValueChange(item._id);
                      setOpen(false);
                    }}
                    className="flex items-center w-full p-2.5 text-sm hover:bg-blue-50 rounded-md cursor-pointer transition-colors group"
                  >
                    <Check
                      className={`mr-2.5 h-4 w-4 transition-opacity ${
                        value === item._id
                          ? "opacity-100 text-blue-600"
                          : "opacity-0 group-hover:opacity-30"
                      }`}
                    />
                    <span
                      className={
                        value === item._id
                          ? "font-medium text-gray-900"
                          : "text-gray-700"
                      }
                    >
                      {item.name}
                    </span>
                  </button>
                ))}
                {hasNextPage && (
                  <Button
                    variant="ghost"
                    className="w-full mt-1.5 h-9 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
