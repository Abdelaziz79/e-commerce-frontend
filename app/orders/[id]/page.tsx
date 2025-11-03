// app/orders/[id]/page.tsx
"use client";

import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { ErrorDisplay } from "@/components/favorites/ErrorDisplay";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { OrderDetailsView } from "@/components/orders/order-page/OrderDetailsView";
import { useCancelOrder, useOrder } from "@/hooks/use-orders";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch the specific order using its ID
  const { data, isLoading, error, refetch } = useOrder(orderId);
  const cancelOrderMutation = useCancelOrder();

  const handleConfirmCancel = async (reason: string) => {
    if (!orderId) return;

    cancelOrderMutation.mutate(
      {
        orderId,
        data: { reason: reason.trim() || undefined },
      },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          // Refetch to get updated order data
          refetch();
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  // Error state or no data
  if (error || !data?.data?.order) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorDisplay
          message={
            error?.message ||
            "Order not found. Please check the order number and try again."
          }
        />
      </div>
    );
  }

  // Extract the order from the nested response structure
  const order = data.data.order;

  return (
    <>
      <OrderDetailsView
        order={order}
        onCancelOrder={() => setCancelDialogOpen(true)}
      />
      <CancelOrderDialog
        order={order}
        isOpen={isCancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirmCancel={handleConfirmCancel}
        isPending={cancelOrderMutation.isPending}
      />
    </>
  );
}
