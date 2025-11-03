// components/admin/orders/AdminOrderDetailsHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderStatusColor, formatOrderStatus } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AdminOrderDetailsHeaderProps {
  order: Order;
}

export function AdminOrderDetailsHeader({
  order,
}: AdminOrderDetailsHeaderProps) {
  const getStatusColor = useOrderStatusColor;

  return (
    <div className="space-y-4">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on{" "}
            {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {formatOrderStatus(order.status)}
          </Badge>
          <Badge
            variant="outline"
            className={
              order.isPaid
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-yellow-50 text-yellow-700 border-yellow-200"
            }
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
