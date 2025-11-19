"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductSearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

export function ProductSearchInput({
  searchTerm,
  onSearchChange,
  isLoading = false,
}: ProductSearchInputProps) {
  // Local state allows immediate typing response
  const [localValue, setLocalValue] = useState(searchTerm);

  // Wait 500ms after typing stops before triggering
  const debouncedValue = useDebounce(localValue, 500);

  // 1. Sync FROM Parent (e.g. when "Reset Filters" is clicked)
  useEffect(() => {
    setLocalValue(searchTerm);
  }, [searchTerm]);

  // 2. Sync TO Parent (trigger search)
  useEffect(() => {
    // NOTE: We do NOT include 'searchTerm' in dependencies here.
    // Including it causes the "Reset Bug" where clearing the parent
    // immediately re-triggers this effect with the old debounced value.

    // Logic: Only search if:
    // 1. The value is empty (to clear results)
    // 2. OR the length is greater than 2 (3 or more chars)
    if (debouncedValue === "" || debouncedValue.length > 2) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, onSearchChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Enter key forces search regardless of length
      onSearchChange(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onSearchChange("");
  };

  return (
    <div className="px-1 py-1">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          <Search className="h-4 w-4" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-none text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />

        {/* Right Side Actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center z-10">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          ) : localValue ? (
            <button
              type="button" // Explicitly set type to button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-0.5 transition-all cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Optional: Helper text for length requirement */}
      {localValue.length > 0 && localValue.length <= 2 && (
        <p className="text-[10px] text-gray-400 mt-1 px-1">
          Type at least 3 characters...
        </p>
      )}
    </div>
  );
}
