// components/admin/orders/AdminOrdersHeader.tsx
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AdminOrdersHeaderProps {
  orderCount: number;
}

export function AdminOrdersHeader({ orderCount }: AdminOrdersHeaderProps) {
  // You would wire this up to the useExportOrders hook
  const handleExport = () => {
    alert("Export functionality to be implemented.");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orderCount.toLocaleString()} order(s) found
        </p>
      </div>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export Orders
      </Button>
    </div>
  );
}
