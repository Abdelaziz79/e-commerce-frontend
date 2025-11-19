// components/checkout/OrderReview.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateOrder } from "@/hooks/use-orders";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import {
  Loader2,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getImageSrc } from "@/lib/utils";

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

  const formatPaymentMethod = (method: string) => {
    return method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-5">
          Order Items ({cart.length})
        </h3>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index}>
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <Image
                    src={getImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  {item.variation && (
                    <div className="flex gap-3 mt-1 text-xs text-slate-500">
                      {item.variation.size && (
                        <span>
                          Size:{" "}
                          <span className="font-medium text-slate-700">
                            {item.variation.size}
                          </span>
                        </span>
                      )}
                      {item.variation.color && (
                        <span>
                          Color:{" "}
                          <span className="font-medium text-slate-700">
                            {item.variation.color}
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">
                    $
                    {(
                      (item.currentPrice || item.price) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              {index < cart.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Shipping Address
              </h4>
              <div className="space-y-0.5 text-sm text-slate-600">
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phoneNumber && (
                  <p className="text-xs text-slate-500 mt-1">
                    {shippingAddress.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Payment Method
              </h4>
              <p className="text-sm text-slate-600">
                {formatPaymentMethod(paymentMethod)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Notes */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <Label
          htmlFor="notes"
          className="text-sm font-bold text-slate-900 block mb-2"
        >
          Order Notes{" "}
          <span className="text-slate-400 font-normal">(Optional)</span>
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special delivery instructions..."
          maxLength={500}
          rows={3}
          className="border-slate-200 rounded-xl resize-none"
        />
        <p className="text-xs text-slate-400 mt-2">
          {notes.length}/500 characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2 border-slate-200 hover:bg-slate-50"
          disabled={createOrder.isPending}
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all"
          disabled={createOrder.isPending}
          size="lg"
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Place Order · ${totalPrice.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
