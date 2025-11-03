// ================================================
// components/orders/order-page/OrderSummaryCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";

interface OrderSummaryCardProps {
  order: Order;
}

const SummaryLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryLine label="Subtotal" value={`$${order.subtotal.toFixed(2)}`} />
        {order.discountAmount > 0 && (
          <SummaryLine
            label={`Discount ${
              order.discount?.code ? `(${order.discount.code})` : ""
            }`}
            value={`-$${order.discountAmount.toFixed(2)}`}
          />
        )}
        <SummaryLine
          label="Shipping"
          value={`$${order.shippingPrice.toFixed(2)}`}
        />
        <SummaryLine label="Tax" value={`$${order.taxPrice.toFixed(2)}`} />
        <Separator />
        <div className="flex justify-between font-semibold text-base">
          <span>Order Total</span>
          <span>${order.totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
