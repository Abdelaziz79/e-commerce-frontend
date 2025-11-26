// components/checkout/OrderReview.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrder } from "@/hooks/use-orders";
import { getImageSrc } from "@/lib/utils";
import { CartItem, CartTotalsData } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  Percent,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface OrderReviewProps {
  cart: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totals: CartTotalsData | null;
  discountCode?: string;
  onBack: () => void;
}

export function OrderReview({
  cart,
  shippingAddress,
  paymentMethod,
  totals,
  discountCode,
  onBack,
}: OrderReviewProps) {
  const router = useRouter();
  const createOrder = useCreateOrder();
  const [notes, setNotes] = useState("");

  // Use backend totals if available, otherwise calculate fallback
  const itemsPrice =
    totals?.itemsPrice ||
    cart.reduce(
      (sum, item) => sum + (item.currentPrice || item.price) * item.quantity,
      0
    );
  const subtotal = totals?.subtotal || itemsPrice;
  const shippingPrice = totals?.shipping || (itemsPrice > 100 ? 0 : 10);
  const taxPrice = totals?.tax || 0;
  const discountAmount = totals?.discount || 0;
  const totalPrice =
    totals?.total || itemsPrice + shippingPrice + taxPrice - discountAmount;

  // Calculate total items count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = async () => {
    // Validate that we have calculated totals
    if (!totals) {
      toast.error("Please wait while we calculate your order totals...");
      return;
    }

    // IMPORTANT: Use currentPrice if available (sale price), otherwise use regular price
    // The backend will validate these prices against the actual product prices
    const orderData = {
      orderItems: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.currentPrice || item.price, // Use the actual price per item
        product:
          typeof item.product === "string" ? item.product : item.product._id,
        image: item.image,
        variation: item.variation,
      })),
      shippingAddress,
      paymentMethod,
      notes: notes.trim() || undefined,
      discountCode: discountCode || undefined,
      // Pass the calculated totals from backend
      // Note: itemsPrice is the total BEFORE discount
      itemsPrice: totals.itemsPrice,
      subtotal: totals.subtotal, // After discount
      taxPrice: totals.tax,
      shippingPrice: totals.shipping,
      totalPrice: totals.total,
      discountAmount: totals.discount,
    };

    console.log("Order Data:", orderData); // Debug log

    createOrder.mutate(orderData, {
      onSuccess: (response) => {
        const orderId = response.data.order._id;
        router.push(`/orders/${orderId}`);
      },
      onError: (error) => {
        console.error("Order creation error:", error); // Debug log
        // Handle specific validation errors
        if (error.validationErrors) {
          error.validationErrors.forEach((err) => {
            toast.error(`${err.path}: ${err.msg}`);
          });
        } else {
          toast.error(error.message || "Failed to create order");
        }
      },
    });
  };

  const formatPaymentMethod = (method: string) => {
    return method.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Order Summary Header */}
      <div className="rounded-2xl p-6 shadow-lg border border-slate-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-6 w-6" />
          <h2 className="text-xl font-bold">Order Summary</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-1">Total Items</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
          <div>
            <p className="mb-1">Order Total</p>
            <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Items ({cart.length} {cart.length === 1 ? "item" : "items"})
        </h3>
        <div className="space-y-4">
          {cart.map((item, index) => {
            const itemTotal = (item.currentPrice || item.price) * item.quantity;
            const hasDiscount =
              item.currentPrice && item.currentPrice < item.price;

            return (
              <div
                key={`${index || item.product}-${item.variation?.sku || index}`}
              >
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
                    <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>

                    {/* Variation Details */}
                    {item.variation && (
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {item.variation.size && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                            Size: {item.variation.size}
                          </span>
                        )}
                        {item.variation.color && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                            Color: {item.variation.color}
                          </span>
                        )}
                        {item.variation.style && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
                            {item.variation.style}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price and Quantity */}
                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        {hasDiscount ? (
                          <>
                            <span className="font-semibold text-red-600">
                              ${item.currentPrice?.toFixed(2)}
                            </span>
                            <span className="line-through text-slate-400">
                              ${item.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-slate-900">
                            ${(item.currentPrice || item.price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-slate-500">each</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">
                        Qty:{" "}
                        <span className="font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-base">
                      ${itemTotal.toFixed(2)}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs text-red-600 font-medium mt-0.5">
                        Saved $
                        {(
                          (item.price - (item.currentPrice || item.price)) *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                {index < cart.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <Separator className="my-6" />
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Subtotal (Items)</span>
            <span className="font-semibold text-slate-900">
              ${itemsPrice.toFixed(2)}
            </span>
          </div>

          {discountAmount > 0 && totals?.discountDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  Discount ({totals.discountDetails.code})
                </span>
                <span className="font-semibold text-green-600">
                  -${discountAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">After Discount</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Shipping
              {totals?.shippingDetails && (
                <span className="text-xs text-slate-500">
                  ({totals.shippingDetails.rateName})
                </span>
              )}
            </span>
            <span className="font-semibold text-slate-900">
              {shippingPrice === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `$${shippingPrice.toFixed(2)}`
              )}
            </span>
          </div>

          {taxPrice > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Tax
                {totals?.taxDetails && (
                  <span className="text-xs text-slate-500">
                    ({totals.taxDetails.rate}%)
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-900">
                ${taxPrice.toFixed(2)}
              </span>
            </div>
          )}

          <Separator className="my-3" />
          <div className="flex justify-between text-base">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-slate-900 text-lg">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 mb-2">
                Shipping Address
              </h4>
              <div className="space-y-0.5 text-sm text-slate-600">
                <p className="font-medium text-slate-700">
                  {shippingAddress.address}
                </p>
                <p>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phoneNumber && (
                  <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    📞 {shippingAddress.phoneNumber}
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
              <p className="text-sm font-medium text-slate-700">
                {formatPaymentMethod(paymentMethod)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Payment will be processed securely
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
          placeholder="Add special delivery instructions, gift message, or any other notes..."
          maxLength={500}
          rows={3}
          className="border-slate-200 rounded-xl resize-none focus:border-slate-400 focus:ring-slate-400"
        />
        <p className="text-xs text-slate-400 mt-2">
          {notes.length}/500 characters
        </p>
      </div>

      {/* Debug Info (Remove in production) */}
      {process.env.NODE_ENV === "development" && totals && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs">
          <p className="font-bold mb-2">Debug Info:</p>
          <p>Items Price: ${totals.itemsPrice.toFixed(2)}</p>
          <p>Subtotal: ${totals.subtotal.toFixed(2)}</p>
          <p>Discount: ${totals.discount.toFixed(2)}</p>
          <p>Tax: ${totals.tax.toFixed(2)}</p>
          <p>Shipping: ${totals.shipping.toFixed(2)}</p>
          <p>Total: ${totals.total.toFixed(2)}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
          disabled={createOrder.isPending}
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all"
          disabled={createOrder.isPending || !totals}
          size="lg"
        >
          {createOrder.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Order...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Place Order · ${totalPrice.toFixed(2)}
            </>
          )}
        </Button>
      </div>

      {/* Warning if no totals calculated */}
      {!totals && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">⚠️ Calculating order totals...</p>
          <p className="text-xs mt-1">
            Please wait while we calculate tax and shipping costs.
          </p>
        </div>
      )}
    </div>
  );
}
