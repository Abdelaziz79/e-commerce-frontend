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
import {
  canCancelOrder,
  formatOrderStatus,
  useOrderStatusColor,
} from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/types/order";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  Eye,
  Package,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
    "on-hold": <AlertCircle className="h-4 w-4" />,
  };
  return icons[status] || <Clock className="h-4 w-4" />;
};

export function OrderCard({ order, onSelectCancel }: OrderCardProps) {
  const getStatusColor = useOrderStatusColor;
  const isCancellable = canCancelOrder(order);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
              <span>Order #{order.orderNumber}</span>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{formatOrderStatus(order.status)}</span>
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Placed on {format(new Date(order.createdAt), "PPP")}
              {order.isPaid && (
                <>
                  {" • "}
                  <span className="text-green-600">Paid</span>
                </>
              )}
              {!order.isPaid && order.status !== "cancelled" && (
                <>
                  {" • "}
                  <span className="text-orange-600">Payment Pending</span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/orders/${order._id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            {isCancellable && (
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
            <div
              key={`${item.product}-${idx}`}
              className="flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                  {item.variation?.sku && (
                    <span className="ml-2 text-xs">
                      SKU: {item.variation.sku}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {order.orderItems.length > 2 && (
            <p className="text-sm text-muted-foreground pl-20">
              +{order.orderItems.length - 2} more item(s)
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Subtotal</p>
            <p>${order.subtotal.toFixed(2)}</p>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <p>
                Discount {order.discount?.code && `(${order.discount.code})`}
              </p>
              <p>-${order.discountAmount.toFixed(2)}</p>
            </div>
          )}
          {order.taxPrice > 0 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Tax</p>
              <p>${order.taxPrice.toFixed(2)}</p>
            </div>
          )}
          {order.shippingPrice > 0 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Shipping</p>
              <p>${order.shippingPrice.toFixed(2)}</p>
            </div>
          )}
          <div className="flex items-center justify-between font-semibold pt-2 border-t">
            <p>Total</p>
            <p>${order.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Shipping Info if available */}
        {order.shipping?.trackingNumber && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">
                  Tracking: {order.shipping.trackingNumber}
                </p>
                {order.shipping.carrier && (
                  <p className="text-blue-700 text-xs">
                    Carrier: {order.shipping.carrier}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
