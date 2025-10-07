// components/cart/EmptyCart.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="p-12 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </Card>
    </div>
  );
}
