"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "-rating", label: "Highest Rated" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
  { value: "-name", label: "Name: Z-A" },
];

export function SortDropdown({ sortBy, setSortBy }: SortDropdownProps) {
  const currentLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort by";

  return (
    <div className="flex items-center gap-2">
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px] h-9 text-sm rounded-none">
          <div className="flex items-center gap-2 ">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
            <SelectValue>
              <span className="font-medium text-gray-900">{currentLabel}</span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
