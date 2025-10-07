// components/orders/order-page/OrderHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canCancelOrder, useOrderStatusColor } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";

interface OrderHeaderProps {
  order: Order;
  onCancelOrder: () => void;
}

export function OrderHeader({ order, onCancelOrder }: OrderHeaderProps) {
  const getStatusColor = useOrderStatusColor;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            className={`py-1 px-3 text-sm capitalize ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </Badge>
          {canCancelOrder(order) && (
            <Button variant="destructive" onClick={onCancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
