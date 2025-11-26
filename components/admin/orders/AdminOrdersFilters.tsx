// components/admin/orders/AdminOrdersFilters.tsx - FIXED VERSION
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X } from "lucide-react";
import { useRef } from "react";
import { OrderStatusFilter } from "./hooks/useOrderFilters";

interface AdminOrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: OrderStatusFilter;
  onStatusChange: (status: OrderStatusFilter) => void;
}

export function AdminOrdersFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: AdminOrdersFiltersProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    onSearchChange("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder="Search by order number, customer name, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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

        {/* Status Filter Tabs */}
        <div className="md:w-auto overflow-x-auto">
          <Tabs
            value={statusFilter}
            onValueChange={(value) =>
              onStatusChange(value as OrderStatusFilter)
            }
          >
            <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-600 shadow-sm">
              <TabsTrigger
                value="all"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="shipped"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Shipped
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Delivered
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
