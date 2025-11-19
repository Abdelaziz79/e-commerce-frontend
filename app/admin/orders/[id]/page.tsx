// app/admin/orders/[id]/page.tsx
"use client";

import { CustomerInfoCard } from "@/components/admin/orders/details/CustomerInfoCard";
import { OrderDetailsHeader } from "@/components/admin/orders/details/OrderDetailsHeader";
import { OrderItemsCard } from "@/components/admin/orders/details/OrderItemsCard";
import { OrderSummaryCard } from "@/components/admin/orders/details/OrderSummaryCard";
import { PaymentInfoCard } from "@/components/admin/orders/details/PaymentInfoCard";
import { ShippingAddressCard } from "@/components/admin/orders/details/ShippingAddressCard";
import { StatusHistoryCard } from "@/components/admin/orders/details/StatusHistoryCard";
import { StatusManagementCard } from "@/components/admin/orders/details/StatusManagementCard";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import ErrorState from "@/components/shared/ErrorState";
import { useOrder } from "@/hooks/use-orders";
import { useParams, useRouter } from "next/navigation";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorState
          error={error}
          title={error?.message || "Failed to load order details"}
        />
      </div>
    );
  }

  const order = data.data.order;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        <OrderDetailsHeader order={order} onBack={() => router.back()} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsCard order={order} />
            <StatusManagementCard order={order} />
            <StatusHistoryCard order={order} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <CustomerInfoCard order={order} />
            <ShippingAddressCard order={order} />
            <OrderSummaryCard order={order} />
            <PaymentInfoCard order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}
