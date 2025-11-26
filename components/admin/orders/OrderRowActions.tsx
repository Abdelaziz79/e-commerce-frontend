// components/admin/orders/OrderRowActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCancelOrder,
  useUpdateOrderStatus,
  useUpdateOrderToDelivered,
  useUpdateOrderToPaid,
} from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/types/order";
import {
  Ban,
  CheckCircle,
  CreditCard,
  Eye,
  MoreVertical,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface OrderRowActionsProps {
  order: Order;
}

export function OrderRowActions({ order }: OrderRowActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateToPaidMutation = useUpdateOrderToPaid();
  const updateToDeliveredMutation = useUpdateOrderToDelivered();
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const handleMarkAsPaid = () => {
    updateToPaidMutation.mutate({
      orderId: order._id,
      data: {
        id: `admin_manual_${Date.now()}`,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address:
          typeof order.user === "object" ? order.user.email : "admin@system",
        payment_method: "Manual Admin Entry",
      },
    });
    setIsOpen(false);
  };

  const handleMarkAsDelivered = () => {
    updateToDeliveredMutation.mutate({
      orderId: order._id,
      note: "Marked as delivered via Quick Actions",
    });
    setIsOpen(false);
  };

  const handleCancelOrder = () => {
    if (
      confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      cancelOrderMutation.mutate({
        orderId: order._id,
        data: { reason: "Cancelled by Admin via Quick Actions" },
      });
    }
    setIsOpen(false);
  };

  const handleStatusUpdate = (status: OrderStatus) => {
    updateStatusMutation.mutate({
      orderId: order._id,
      data: { status },
    });
    setIsOpen(false);
  };

  const isPending =
    updateToPaidMutation.isPending ||
    updateToDeliveredMutation.isPending ||
    updateStatusMutation.isPending ||
    cancelOrderMutation.isPending;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 data-[state=open]:bg-gray-100"
          disabled={isPending}
        >
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] border-gray-200 shadow-lg"
      >
        <DropdownMenuLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Actions
        </DropdownMenuLabel>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={`/admin/orders/${order._id}`}
            className="flex items-center w-full"
          >
            <Eye className="mr-2 h-4 w-4 text-gray-400" />
            View Details
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100" />

        {/* Mark as Paid Action */}
        {!order.isPaid && order.status !== "cancelled" && (
          <DropdownMenuItem
            onClick={handleMarkAsPaid}
            className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Mark as Paid
          </DropdownMenuItem>
        )}

        {/* Mark as Delivered Action */}
        {order.status === "shipped" && !order.isDelivered && (
          <DropdownMenuItem
            onClick={handleMarkAsDelivered}
            className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50"
          >
            <Truck className="mr-2 h-4 w-4" />
            Mark Delivered
          </DropdownMenuItem>
        )}

        {/* Quick Status: Pending -> Processing */}
        {order.status === "pending" && (
          <DropdownMenuItem
            onClick={() => handleStatusUpdate("processing")}
            className="cursor-pointer"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-gray-400" />
            Mark Processing
          </DropdownMenuItem>
        )}

        {/* Cancel Action */}
        {["pending", "processing", "on-hold"].includes(order.status) && (
          <>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              onClick={handleCancelOrder}
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
