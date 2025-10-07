// components/orders/OrderList.tsx
import { Order } from "@/types/order";
import { EmptyOrders } from "./EmptyOrders";
import { OrderCard } from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  searchQuery: string;
  onSelectCancelOrder: (order: Order) => void;
}

export function OrderList({
  orders,
  searchQuery,
  onSelectCancelOrder,
}: OrderListProps) {
  if (orders.length === 0) {
    return <EmptyOrders hasSearch={!!searchQuery} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          onSelectCancel={() => onSelectCancelOrder(order)}
        />
      ))}
    </div>
  );
}
