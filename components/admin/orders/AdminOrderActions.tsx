// components/admin/orders/AdminOrderActions.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatOrderStatus } from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/types/order";
import { Loader2, Save, Truck } from "lucide-react";
import { useState } from "react";

interface AdminOrderActionsProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  onAddTracking: () => void;
  isUpdatingStatus: boolean;
}

const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "on-hold",
  "cancelled",
  "refunded",
  "failed",
];

export function AdminOrderActions({
  order,
  onStatusChange,
  onAddTracking,
  isUpdatingStatus,
}: AdminOrderActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status
  );

  const canUpdate = selectedStatus !== order.status;

  const handleUpdate = () => {
    if (canUpdate) {
      onStatusChange(selectedStatus);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Update Status
          </label>
          <div className="flex gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(v: OrderStatus) => setSelectedStatus(v)}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {formatOrderStatus(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleUpdate}
              disabled={!canUpdate || isUpdatingStatus}
              size="icon"
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="sr-only">Save status</span>
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onAddTracking}
          disabled={isUpdatingStatus}
        >
          <Truck className="mr-2 h-4 w-4" />
          {order.shipping?.trackingNumber
            ? "Edit Tracking Info"
            : "Add Tracking Info"}
        </Button>
      </CardContent>
    </Card>
  );
}
