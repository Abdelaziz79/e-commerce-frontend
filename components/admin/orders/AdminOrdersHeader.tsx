// components/admin/orders/AdminOrdersHeader.tsx
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface AdminOrdersHeaderProps {
  orderCount: number;
  onExport: () => void;
  isExporting: boolean;
}

export function AdminOrdersHeader({
  orderCount,
  onExport,
  isExporting,
}: AdminOrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orderCount.toLocaleString()} order(s) found
        </p>
      </div>
      <Button variant="outline" onClick={onExport} disabled={isExporting}>
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        {isExporting ? "Exporting..." : "Export Orders"}
      </Button>
    </div>
  );
}
