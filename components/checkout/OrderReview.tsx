// components/checkout/OrderReview.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateOrder } from "@/hooks/use-orders";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import {
  Loader2,
  Package,
  MapPin,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface OrderReviewProps {
  cart: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  onBack: () => void;
}

export function OrderReview({
  cart,
  shippingAddress,
  paymentMethod,
  onBack,
}: OrderReviewProps) {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const [notes, setNotes] = useState("");

  // Calculate prices
  const itemsPrice = cart.reduce(
    (sum, item) => sum + (item.currentPrice || item.price) * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.1;
  const taxPrice = itemsPrice * taxRate;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async () => {
    const orderData = {
      orderItems: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.currentPrice || item.price,
        product:
          typeof item.product === "string"
            ? item.product
            : (item.product as { _id: string })._id,
        image: item.image,
        variation: item.variation,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      subtotal: itemsPrice,
      notes: notes.trim() || undefined,
    };

    createOrder.mutate(orderData, {
      onSuccess: (response) => {
        const orderId = response.data.order._id;
        router.push(`/orders/${orderId}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Order Items</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your order
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index}>
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{item.name}</h4>
                    {item.variation && (
                      <div className="flex gap-2 mt-1">
                        {item.variation.size && (
                          <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                            Size: {item.variation.size}
                          </span>
                        )}
                        {item.variation.color && (
                          <span className="text-sm bg-gray-100 px-2 py-0.5 rounded">
                            Color: {item.variation.color}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      $
                      {(
                        (item.currentPrice || item.price) * item.quantity
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(item.currentPrice || item.price).toFixed(2)} each
                    </p>
                  </div>
                </div>
                {index < cart.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl">Shipping Address</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-1 text-base">
            <p className="font-medium">{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
            {shippingAddress.phoneNumber && (
              <p className="text-muted-foreground mt-2">
                {shippingAddress.phoneNumber}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-green-600" />
            <CardTitle className="text-xl">Payment Method</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-base font-medium capitalize">
            {paymentMethod
              .replace("_", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-purple-600" />
            <CardTitle className="text-xl">Order Notes</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Optional: Add special delivery instructions
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Label htmlFor="notes" className="text-base font-semibold">
            Special Instructions
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Please ring the doorbell, leave at door, etc."
            maxLength={500}
            rows={4}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {notes.length}/500 characters
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={createOrder.isPending}
          size="lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Payment
        </Button>
        <Button
          onClick={handlePlaceOrder}
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          disabled={createOrder.isPending}
          size="lg"
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Place Order - ${totalPrice.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
