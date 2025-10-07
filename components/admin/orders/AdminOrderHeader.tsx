// components/admin/orders/AdminOrderHeader.tsx
import { Badge } from "@/components/ui/badge";
import { useOrderStatusColor } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AdminOrderHeader({ order }: { order: Order }) {
  const getStatusColor = useOrderStatusColor;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Orders
      </Link>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <Badge
          className={`py-1 px-3 text-sm capitalize ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </Badge>
      </div>
    </div>
  );
}
