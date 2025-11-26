// components/users/admin/TableToolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersParams } from "@/types/admin";
import { Search, X } from "lucide-react";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  params: UsersParams;
  onFilterChange: (filters: Partial<UsersParams>) => void;
  onClearFilters: () => void;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  params,
  onFilterChange,
  onClearFilters,
}: TableToolbarProps) {
  const hasActiveFilters = !!searchQuery || params.status || params.role;

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
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

        {/* Status Filter */}
        <Select
          value={params.status || "all"}
          onValueChange={(val) =>
            onFilterChange({
              status:
                val === "all"
                  ? undefined
                  : (val as "active" | "banned" | "suspended"),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm border-gray-200 rounded-none">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select
          value={params.role || "all"}
          onValueChange={(val) =>
            onFilterChange({
              role: val === "all" ? undefined : (val as "user" | "admin"),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[140px] h-9 text-sm border-gray-200 rounded-none">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
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
