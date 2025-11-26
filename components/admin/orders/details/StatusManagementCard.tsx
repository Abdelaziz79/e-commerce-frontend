// components/admin/orders/details/StatusManagementCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatOrderStatus,
  useCancelOrder,
  useUpdateOrderStatus,
  useUpdateOrderToDelivered,
} from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/types/order";
import { Ban, Loader2, Save, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StatusManagementCardProps {
  order: Order;
}

export function StatusManagementCard({ order }: StatusManagementCardProps) {
  const updateStatusMutation = useUpdateOrderStatus();
  const updateToDeliveredMutation = useUpdateOrderToDelivered();
  const cancelOrderMutation = useCancelOrder();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");

  const statuses: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "on-hold",
    "failed",
    "completed",
  ];

  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        orderId: order._id,
        data: {
          status: selectedStatus,
          note: statusNote || undefined,
          shippingInfo:
            trackingNumber && carrier ? { trackingNumber, carrier } : undefined,
        },
      });
      // Reset form
      setSelectedStatus("");
      setStatusNote("");
      setTrackingNumber("");
      setCarrier("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      await updateToDeliveredMutation.mutateAsync({
        orderId: order._id,
        note: "Order marked as delivered by admin",
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCancelOrder = () => {
    if (
      confirm(
        "Are you sure you want to cancel this order? This cannot be undone."
      )
    ) {
      cancelOrderMutation.mutate({
        orderId: order._id,
        data: { reason: "Cancelled by Admin via Details Page" },
      });
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Truck className="h-4 w-4 text-gray-500" />
          Update Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Status Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            New Status
          </label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
          >
            <SelectTrigger className="h-10 border-gray-200 rounded-lg">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status} className="text-sm">
                  {formatOrderStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Shipping Information - Only show when shipped status is selected */}
        {selectedStatus === "shipped" && (
          <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-900">
              Shipping Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Carrier
                </label>
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger className="h-9 border-gray-200 rounded-lg bg-white">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ups">UPS</SelectItem>
                    <SelectItem value="fedex">FedEx</SelectItem>
                    <SelectItem value="dhl">DHL</SelectItem>
                    <SelectItem value="usps">USPS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Tracking Number
                </label>
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking #"
                  className="h-9 text-sm border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Note */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Note <span className="text-gray-400">(Optional)</span>
          </label>
          <Textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Add a note about this status update..."
            rows={3}
            className="resize-none border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={handleUpdateStatus}
            disabled={!selectedStatus || updateStatusMutation.isPending}
            className="flex-1 h-10 rounded-lg min-w-[120px]"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Status
              </>
            )}
          </Button>

          {/* Quick Delivered Button */}
          {order.status === "shipped" && !order.isDelivered && (
            <Button
              onClick={handleMarkAsDelivered}
              disabled={updateToDeliveredMutation.isPending}
              variant="outline"
              className="h-10 px-4 rounded-lg border-gray-200"
            >
              {updateToDeliveredMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Mark Delivered"
              )}
            </Button>
          )}

          {/* Cancel Button */}
          {["pending", "processing", "on-hold"].includes(order.status) && (
            <Button
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
              variant="outline"
              className="h-10 px-4 rounded-lg border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {cancelOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel Order
                </>
              )}
            </Button>
          )}
        </div>

        {/* Current Shipping Info Display */}
        {order.shipping &&
          (order.shipping.trackingNumber || order.shipping.carrier) && (
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">
                Current Shipping Info
              </h4>
              <div className="space-y-1.5 text-sm">
                {order.shipping.carrier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carrier:</span>
                    <span className="text-gray-900 font-medium">
                      {order.shipping.carrier.toUpperCase()}
                    </span>
                  </div>
                )}
                {order.shipping.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {order.shipping.trackingNumber}
                    </span>
                  </div>
                )}
                {order.shipping.estimatedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Delivery:</span>
                    <span className="text-gray-900">
                      {new Date(
                        order.shipping.estimatedDeliveryDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
