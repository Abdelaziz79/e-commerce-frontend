// components/admin/orders/AdminOrderDetailsView.tsx
import { OrderItemsList } from "@/components/orders/order-page/OrderItemsList";
import { OrderStatusTimeline } from "@/components/orders/order-page/OrderStatusTimeline";
import { OrderSummaryCard } from "@/components/orders/order-page/OrderSummaryCard";
import { Order, OrderStatus } from "@/types/order";
import { AdminOrderActions } from "./AdminOrderActions";
import { AdminOrderHeader } from "./AdminOrderHeader";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { ShippingInfoCard } from "./ShippingInfoCard";

interface AdminOrderDetailsViewProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  onAddTracking: () => void;
  isUpdatingStatus: boolean;
}

export function AdminOrderDetailsView({
  order,
  onStatusChange,
  onAddTracking,
  isUpdatingStatus,
}: AdminOrderDetailsViewProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <AdminOrderHeader order={order} />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <OrderItemsList items={order.orderItems} />
          <OrderStatusTimeline history={order.statusHistory} />
        </div>
        {/* Sidebar / Actions Column */}
        <div className="lg:col-span-1 space-y-8">
          <AdminOrderActions
            order={order}
            onStatusChange={onStatusChange}
            onAddTracking={onAddTracking}
            isUpdatingStatus={isUpdatingStatus}
          />
          <OrderSummaryCard order={order} />
          <CustomerInfoCard
            user={order.user}
            shippingAddress={order.shippingAddress}
          />
          <ShippingInfoCard shipping={order.shipping} />
        </div>
      </div>
    </div>
  );
}
