// components/checkout/OrderSummaryCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";

interface OrderSummaryCardProps {
  cart: CartItem[];
  cartTotal: number;
  shippingAddress: ShippingAddress | null;
}

export function OrderSummaryCard({
  cart,
  cartTotal,
  shippingAddress,
}: OrderSummaryCardProps) {
  const itemsPrice = cartTotal;
  const shippingPrice = shippingAddress && itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.1; // 10%
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + (shippingPrice || 0) + taxPrice;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items ({cart.length}):</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>
              {shippingAddress && shippingPrice === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `${(shippingPrice || 10).toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        {!shippingAddress && itemsPrice < 100 && (
          <p className="text-sm text-gray-600">
            Add ${(100 - itemsPrice).toFixed(2)} more for free shipping!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
