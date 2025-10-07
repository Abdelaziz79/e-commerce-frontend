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
  const { data, isLoading, error } = useOrder(orderId);
  const cancelOrderMutation = useCancelOrder();

  const handleConfirmCancel = async (reason: string) => {
    cancelOrderMutation.mutate(
      { orderId, data: { reason } },
      {
        onSuccess: () => {
          setCancelDialogOpen(false); // Close dialog on success
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (error || !data?.data) {
    return (
      <ErrorDisplay
        message={
          error?.message ||
          "Order not found. Please check the ID and try again."
        }
      />
    );
  }

  const order = data.data;

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
