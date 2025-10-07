// components/orders/order-page/OrderDetailsView.tsx
import { Order } from "@/types/order";
import { OrderHeader } from "./OrderHeader";
import { OrderInfoCard } from "./OrderInfoCard";
import { OrderItemsList } from "./OrderItemsList";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { OrderSummaryCard } from "./OrderSummaryCard";

interface OrderDetailsViewProps {
  order: Order;
  onCancelOrder: () => void;
}

export function OrderDetailsView({
  order,
  onCancelOrder,
}: OrderDetailsViewProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <OrderHeader order={order} onCancelOrder={onCancelOrder} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <OrderStatusTimeline history={order.statusHistory} />
          <OrderItemsList items={order.orderItems} />
          <OrderInfoCard
            title="Shipping Address"
            details={[
              { label: "Address", value: order.shippingAddress.address },
              { label: "City", value: order.shippingAddress.city },
              { label: "Postal Code", value: order.shippingAddress.postalCode },
              { label: "Country", value: order.shippingAddress.country },
            ]}
          />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          <OrderSummaryCard order={order} />
          <OrderInfoCard
            title="Payment Information"
            details={[
              { label: "Payment Method", value: order.paymentMethod },
              {
                label: "Payment Status",
                value: order.isPaid ? "Paid" : "Awaiting Payment",
                isBadge: true,
                color: order.isPaid ? "green" : "yellow",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
