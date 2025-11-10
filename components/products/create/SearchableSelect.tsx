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
          className="w-full justify-between font-normal text-left h-9 text-sm border-gray-200 hover:bg-gray-50 rounded-none"
        >
          <span
            className={selectedItemName ? "text-gray-900" : "text-gray-500"}
          >
            {selectedItemName || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-md border-gray-200 rounded-none">
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-8 text-xs border-gray-200 rounded-none"
            />
          </div>
        </div>
        <ScrollArea className="h-60">
          <div className="p-1">
            {isLoading && !isFetchingNextPage ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-xs text-gray-500">No results found</p>
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
                    className="flex items-center w-full p-2 text-xs hover:bg-gray-100 transition-colors"
                  >
                    <Check
                      className={`mr-2 h-3.5 w-3.5 ${
                        value === item._id
                          ? "opacity-100 text-gray-900"
                          : "opacity-0"
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
                    className="w-full mt-1 h-8 text-xs rounded-none"
                    onClick={fetchNextPage}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
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
