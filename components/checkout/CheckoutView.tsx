// components/checkout/CheckoutView.tsx
import { useState } from "react";
import { CheckoutSteps } from "./CheckoutSteps";
import { ShippingForm } from "./ShippingForm";
import { PaymentForm } from "./PaymentForm";
import { OrderReview } from "./OrderReview";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";

interface CheckoutViewProps {
  cart: CartItem[];
  cartTotal: number;
}

export function CheckoutView({ cart, cartTotal }: CheckoutViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (method: string) => {
    setPaymentMethod(method);
    setCurrentStep(3);
  };

  const handleBackToShipping = () => {
    setCurrentStep(1);
  };

  const handleBackToPayment = () => {
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Complete your purchase securely
          </p>
        </div>

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  initialData={shippingAddress}
                />
              </div>
            )}

            {currentStep === 2 && shippingAddress && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  onBack={handleBackToShipping}
                  initialMethod={paymentMethod}
                />
              </div>
            )}

            {currentStep === 3 && shippingAddress && paymentMethod && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <OrderReview
                  cart={cart}
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  onBack={handleBackToPayment}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              cart={cart}
              cartTotal={cartTotal}
              shippingAddress={shippingAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
