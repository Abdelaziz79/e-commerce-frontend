// components/admin/orders/AdminOrdersHeader.tsx
import { Button } from "@/components/ui/button";
import { Download, Loader2, Package } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-xl">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Orders
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Manage and track all customer orders
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onExport}
          disabled={isExporting}
          className="h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Exporting..." : "Export Orders"}
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-900 rounded-full" />
          <span className="text-sm font-medium text-gray-900">
            {orderCount.toLocaleString()}
          </span>
          <span className="text-sm text-gray-600">
            {orderCount === 1 ? "order" : "orders"} found
          </span>
        </div>
      </div>
    </div>
  );
}
