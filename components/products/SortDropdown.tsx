// app/products/components/SortDropdown.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const sortOptions = {
  "-createdAt": "Newest",
  "-rating": "Highest Rated",
  price: "Price: Low to High",
  "-price": "Price: High to Low",
};

export function SortDropdown({ sortBy, setSortBy }: SortDropdownProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-2">Sort by:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white border-gray-300 rounded-md"
          >
            {sortOptions[sortBy as keyof typeof sortOptions]}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white border-gray-200 shadow-lg rounded-lg"
        >
          {Object.entries(sortOptions).map(([value, label]) => (
            <DropdownMenuItem key={value} onClick={() => setSortBy(value)}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
