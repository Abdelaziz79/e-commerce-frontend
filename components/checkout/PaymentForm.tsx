// components/checkout/PaymentForm.tsx
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Banknote,
  Wallet,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PaymentFormProps {
  onSubmit: (method: string) => void;
  onBack: () => void;
  initialMethod: string;
}

export function PaymentForm({
  onSubmit,
  onBack,
  initialMethod,
}: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState(initialMethod || "");

  const paymentMethods = [
    {
      id: "card",
      label: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: Wallet,
      description: "Pay securely with PayPal",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod) {
      onSubmit(selectedMethod);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose how you&apos;d like to pay
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Methods */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              htmlFor={method.id}
              className={cn(
                "flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all",
                selectedMethod === method.id
                  ? "border-slate-900 bg-slate-50 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              )}
            >
              <input
                type="radio"
                id={method.id}
                name="payment-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="mt-1 h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <method.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      selectedMethod === method.id
                        ? "text-slate-900"
                        : "text-slate-400"
                    )}
                  />
                  <span className="font-semibold text-slate-900">
                    {method.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{method.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border-2 border-slate-200 hover:bg-slate-50"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all"
            disabled={!selectedMethod}
            size="lg"
          >
            Review Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
