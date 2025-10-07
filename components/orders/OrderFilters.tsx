// components/orders/OrderFilters.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatus } from "@/types/order";
import { Search } from "lucide-react";

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (status: OrderStatus | "all") => void;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrderFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number or product..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => onStatusChange(v as OrderStatus | "all")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
