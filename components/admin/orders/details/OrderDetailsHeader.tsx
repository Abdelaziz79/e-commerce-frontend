// components/admin/orders/details/OrderDetailsHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatOrderStatus, useOrderStatusColor } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { ArrowLeft, FileText, Package } from "lucide-react";
import Link from "next/link";

interface OrderDetailsHeaderProps {
  order: Order;
  onBack: () => void;
}

export function OrderDetailsHeader({ order, onBack }: OrderDetailsHeaderProps) {
  const getStatusColor = useOrderStatusColor;

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="h-9 px-3 rounded-xl hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2 bg-gray-900 rounded-xl">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <Badge
              variant="outline"
              className={`${getStatusColor(
                order.status
              )} inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {formatOrderStatus(order.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Placed on{" "}
            {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            asChild
            className="h-10 px-4 rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <Link href={`/admin/orders/${order._id}/invoice`}>
              <FileText className="h-4 w-4 mr-2" />
              View Invoice
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
