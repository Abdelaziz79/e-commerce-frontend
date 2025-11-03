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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your purchase in a few simple steps
          </p>
        </div>

        <CheckoutSteps currentStep={currentStep} />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                initialData={shippingAddress}
              />
            )}

            {currentStep === 2 && shippingAddress && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={handleBackToShipping}
                initialMethod={paymentMethod}
              />
            )}

            {currentStep === 3 && shippingAddress && paymentMethod && (
              <OrderReview
                cart={cart}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                onBack={handleBackToPayment}
              />
            )}
          </div>

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
