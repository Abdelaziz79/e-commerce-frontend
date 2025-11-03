// components/orders/order-page/OrderHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  canCancelOrder,
  formatOrderStatus,
  useOrderStatusColor,
} from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderHeaderProps {
  order: Order;
  onCancelOrder: () => void;
}

export function OrderHeader({ order, onCancelOrder }: OrderHeaderProps) {
  const getStatusColor = useOrderStatusColor;
  const isCancellable = canCancelOrder(order);

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge
            className={`py-1 px-3 text-sm ${getStatusColor(order.status)}`}
          >
            {formatOrderStatus(order.status)}
          </Badge>
          {isCancellable && (
            <Button variant="destructive" onClick={onCancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
