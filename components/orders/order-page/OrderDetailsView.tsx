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
              ...(order.shippingAddress.phoneNumber
                ? [{ label: "Phone", value: order.shippingAddress.phoneNumber }]
                : []),
            ]}
          />
          {order.shipping?.trackingNumber && (
            <OrderInfoCard
              title="Shipping Information"
              details={[
                ...(order.shipping.carrier
                  ? [{ label: "Carrier", value: order.shipping.carrier }]
                  : []),
                {
                  label: "Tracking Number",
                  value: order.shipping.trackingNumber,
                },
                ...(order.shipping.estimatedDeliveryDate
                  ? [
                      {
                        label: "Est. Delivery",
                        value: new Date(
                          order.shipping.estimatedDeliveryDate
                        ).toLocaleDateString(),
                      },
                    ]
                  : []),
              ]}
            />
          )}
          {order.notes && (
            <OrderInfoCard
              title="Order Notes"
              details={[{ label: "Note", value: order.notes }]}
            />
          )}
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
          <OrderSummaryCard order={order} />
          <OrderInfoCard
            title="Payment Information"
            details={[
              {
                label: "Payment Method",
                value: order.paymentMethod.toUpperCase(),
              },
              {
                label: "Payment Status",
                value: order.isPaid ? "Paid" : "Awaiting Payment",
                isBadge: true,
                color: order.isPaid ? "green" : "yellow",
              },
              ...(order.isPaid && order.paidAt
                ? [
                    {
                      label: "Paid On",
                      value: new Date(order.paidAt).toLocaleDateString(),
                    },
                  ]
                : []),
            ]}
          />
          {order.isDelivered && order.deliveredAt && (
            <OrderInfoCard
              title="Delivery Information"
              details={[
                {
                  label: "Delivered On",
                  value: new Date(order.deliveredAt).toLocaleDateString(),
                },
                {
                  label: "Status",
                  value: "Delivered",
                  isBadge: true,
                  color: "green",
                },
              ]}
            />
          )}
          {order.refund && (
            <OrderInfoCard
              title="Refund Information"
              details={[
                {
                  label: "Amount",
                  value: `$${order.refund.amount.toFixed(2)}`,
                },
                {
                  label: "Reason",
                  value: order.refund.reason,
                },
                {
                  label: "Status",
                  value: order.refund.status,
                  isBadge: true,
                  color:
                    order.refund.status === "processed" ? "green" : "yellow",
                },
                {
                  label: "Requested On",
                  value: new Date(order.refund.date).toLocaleDateString(),
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
