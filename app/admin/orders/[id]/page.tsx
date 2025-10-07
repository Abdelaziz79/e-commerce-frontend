// app/admin/orders/[id]/page.tsx
"use client";

import { AddTrackingInfoDialog } from "@/components/admin/orders/AddTrackingInfoDialog";
import { AdminOrderDetailsView } from "@/components/admin/orders/AdminOrderDetailsView";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { ErrorDisplay } from "@/components/favorites/ErrorDisplay";
import {
  useAddTrackingInfo,
  useOrder,
  useUpdateOrderStatus,
} from "@/hooks/use-orders";
import { AddTrackingInfoData, OrderStatus } from "@/types/order";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [isTrackingDialogOpen, setTrackingDialogOpen] = useState(false);

  // Re-use the same useOrder hook
  const { data, isLoading, error } = useOrder(orderId);

  // Admin-specific mutation hooks
  const updateStatusMutation = useUpdateOrderStatus();
  const addTrackingMutation = useAddTrackingInfo();

  // Handler to update the order's status
  const handleStatusUpdate = (status: OrderStatus) => {
    updateStatusMutation.mutate({
      orderId,
      data: { status },
    });
  };

  // Handler to add tracking information
  const handleAddTracking = (trackingData: AddTrackingInfoData) => {
    addTrackingMutation.mutate(
      { orderId, data: trackingData },
      {
        onSuccess: () => {
          setTrackingDialogOpen(false); // Close dialog on success
        },
        onError: (err) => {
          // Toast is already handled in the hook, but you can add more logic here
          console.error("Failed to add tracking info:", err);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (error || !data?.data) {
    return <ErrorDisplay message={error?.message || "Order not found."} />;
  }

  const order = data.data;

  return (
    <>
      <AdminOrderDetailsView
        order={order}
        onStatusChange={handleStatusUpdate}
        onAddTracking={() => setTrackingDialogOpen(true)}
        isUpdatingStatus={updateStatusMutation.isPending}
      />
      <AddTrackingInfoDialog
        isOpen={isTrackingDialogOpen}
        onClose={() => setTrackingDialogOpen(false)}
        onConfirm={handleAddTracking}
        isPending={addTrackingMutation.isPending}
      />
    </>
  );
}
