// components/orders/OrderCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { canCancelOrder, useOrderStatusColor } from "@/hooks/use-orders"; // Import the corrected function
import { Order, OrderStatus } from "@/types/order";
import { format } from "date-fns";
import { CheckCircle, Clock, Eye, Package, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderCardProps {
  order: Order;
  onSelectCancel: () => void;
}

const getStatusIcon = (status: OrderStatus) => {
  const icons: Record<OrderStatus, React.ReactNode> = {
    pending: <Clock className="h-4 w-4" />,
    processing: <Package className="h-4 w-4" />,
    shipped: <Truck className="h-4 w-4" />,
    delivered: <CheckCircle className="h-4 w-4" />,
    completed: <CheckCircle className="h-4 w-4" />,
    cancelled: <XCircle className="h-4 w-4" />,
    failed: <XCircle className="h-4 w-4" />,
    refunded: <XCircle className="h-4 w-4" />,
    "on-hold": <Clock className="h-4 w-4" />,
  };
  return icons[status] || <Clock className="h-4 w-4" />;
};

export function OrderCard({ order, onSelectCancel }: OrderCardProps) {
  const getStatusColor = useOrderStatusColor;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Order #{order.orderNumber}
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status}</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              Placed on {format(new Date(order.createdAt), "PPP")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/orders/${order._id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            {/* FIX: Call the regular function here */}
            {canCancelOrder(order) && (
              <Button variant="destructive" size="sm" onClick={onSelectCancel}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Order Items Preview */}
        <div className="space-y-3 mb-4">
          {order.orderItems.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {order.orderItems.length > 2 && (
            <p className="text-sm text-muted-foreground">
              +{order.orderItems.length - 2} more item(s)
            </p>
          )}
        </div>
        {/* Order Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
