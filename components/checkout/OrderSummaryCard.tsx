// components/checkout/OrderSummaryCard.tsx (UPDATED - Shows discount errors)
import { CartItem, CartTotalsData } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import {
  Package,
  Truck,
  Lock,
  Loader2,
  Tag,
  Percent,
  TrendingDown,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrderSummaryCardProps {
  cart: CartItem[];
  cartTotal: number;
  shippingAddress: ShippingAddress | null;
  totals: CartTotalsData | null;
  isCalculating: boolean;
  onDiscountChange?: (code: string) => void;
  currentStep?: number;
  discountError?: string | null;
}

export function OrderSummaryCard({
  cart,
  cartTotal,
  shippingAddress,
  totals,
  isCalculating,
  onDiscountChange,
  currentStep = 1,
  discountError = null, // NEW
}: OrderSummaryCardProps) {
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [showError, setShowError] = useState(false);

  // Use backend totals if available, otherwise use estimated
  const itemsPrice = totals?.itemsPrice || cartTotal;
  const subtotal = totals?.subtotal || cartTotal;
  const tax = totals?.tax || 0;
  const shipping =
    totals?.shipping || (shippingAddress && cartTotal > 100 ? 0 : 10);
  const discount = totals?.discount || 0;
  const total = totals?.total || itemsPrice + tax + shipping - discount;

  // Calculate potential savings
  const potentialSavings = cart.reduce((sum, item) => {
    if (item.currentPrice && item.currentPrice < item.price) {
      return sum + (item.price - item.currentPrice) * item.quantity;
    }
    return sum;
  }, 0);

  // Show error when discount error changes
  useEffect(() => {
    if (discountError) {
      setShowError(true);
      // Clear applied discount if there's an error
      setAppliedDiscount("");
      setDiscountInput("");
    } else {
      setShowError(false);
    }
  }, [discountError]);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) {
      toast.error("Please enter a discount code");
      return;
    }
    if (!shippingAddress) {
      toast.error("Please complete shipping information first");
      return;
    }

    setIsApplying(true);
    setShowError(false);
    const upperCode = discountInput.trim().toUpperCase();

    // Temporarily set applied discount (will be cleared if invalid)
    setAppliedDiscount(upperCode);
    onDiscountChange?.(upperCode);

    // Simulate API delay
    setTimeout(() => {
      setIsApplying(false);
    }, 800);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount("");
    setDiscountInput("");
    setShowError(false);
    onDiscountChange?.("");
    toast.success("Discount removed");
  };

  const isEstimate = !totals && currentStep === 1;
  const hasValidDiscount = appliedDiscount && discount > 0 && !discountError;

  return (
    <div className="sticky top-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
        Order Summary
      </h3>

      {isCalculating ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Calculating totals...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Package className="h-4 w-4" />
                <span>Subtotal ({cart.length} items)</span>
              </div>
              <span className="font-semibold text-slate-900">
                ${itemsPrice.toFixed(2)}
              </span>
            </div>

            {potentialSavings > 0 && (
              <div className="flex items-center justify-between text-sm bg-green-50 -mx-3 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">Sale Savings</span>
                </div>
                <span className="font-semibold text-green-700">
                  -${potentialSavings.toFixed(2)}
                </span>
              </div>
            )}

            {discount > 0 && totals?.discountDetails && !discountError && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Percent className="h-4 w-4" />
                    <span>Discount ({totals.discountDetails.code})</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">After Discount</span>
                  <span className="font-semibold text-slate-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="h-4 w-4" />
                <span>Shipping</span>
                {totals?.shippingDetails && (
                  <span className="text-xs text-slate-500">
                    ({totals.shippingDetails.rateName})
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "font-semibold",
                  shipping === 0 ? "text-emerald-600" : "text-slate-900"
                )}
              >
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            {tax > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Tag className="h-4 w-4" />
                  <span>Tax</span>
                  {totals?.taxDetails && (
                    <span className="text-xs text-slate-500">
                      ({totals.taxDetails.rate}%)
                    </span>
                  )}
                </div>
                <span className="font-semibold text-slate-900">
                  ${tax.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Discount Code Input */}
          {onDiscountChange && currentStep >= 1 && (
            <div className="mb-6">
              {hasValidDiscount ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      {appliedDiscount}
                    </p>
                    {totals?.discountDetails?.description && (
                      <p className="text-xs text-green-700 mt-1">
                        {totals.discountDetails.description}
                      </p>
                    )}
                    <p className="text-xs text-green-600 mt-1">
                      Saved ${discount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoveDiscount}
                    className="text-green-700 hover:text-green-900 hover:bg-green-100"
                    disabled={isApplying}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={discountInput}
                      onChange={(e) =>
                        setDiscountInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyDiscount()
                      }
                      disabled={isApplying}
                      className="h-10"
                    />
                    <Button
                      size="sm"
                      onClick={handleApplyDiscount}
                      disabled={
                        !discountInput.trim() || !shippingAddress || isApplying
                      }
                      className="h-10"
                    >
                      {isApplying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  {/* Show discount error */}
                  {showError && discountError && (
                    <Alert className="border-red-200 bg-red-50 animate-in fade-in slide-in-from-top-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-xs text-red-900 font-medium">
                        {discountError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Show validating state */}
                  {isCalculating && appliedDiscount && !showError && (
                    <Alert className="border-blue-200 bg-blue-50 animate-in fade-in">
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      <AlertDescription className="text-xs text-blue-900">
                        Validating discount code...
                      </AlertDescription>
                    </Alert>
                  )}

                  {!shippingAddress && discountInput && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Complete shipping info to apply discount
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 mb-6">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-slate-900">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-900">
                  ${total.toFixed(2)}
                </span>
                {isEstimate && (
                  <p className="text-xs text-slate-500 mt-1">Estimated total</p>
                )}
              </div>
            </div>
          </div>

          {/* Free Shipping Progress */}
          {!shippingAddress && itemsPrice < 100 && (
            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                  <span>Free shipping progress</span>
                  <span>${itemsPrice.toFixed(2)} / $100.00</span>
                </div>
                <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                    style={{
                      width: `${Math.min((itemsPrice / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-emerald-600">
                  Add ${(100 - itemsPrice).toFixed(2)} more for free shipping
                </p>
              </div>
            </div>
          )}

          {/* Estimate Warning */}
          {isEstimate && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs text-amber-900">
                Final totals will be calculated after adding shipping address
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Security Badge */}
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          <span>Secure checkout powered by SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
