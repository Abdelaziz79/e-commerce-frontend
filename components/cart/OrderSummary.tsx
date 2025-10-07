// components/cart/OrderSummary.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface OrderSummaryProps {
  cartTotal: number;
}

export function OrderSummary({ cartTotal }: OrderSummaryProps) {
  return (
    <Card className="p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping:</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
      <Button className="w-full" size="lg" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
      <Button variant="outline" className="w-full mt-2" asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </Card>
  );
}
