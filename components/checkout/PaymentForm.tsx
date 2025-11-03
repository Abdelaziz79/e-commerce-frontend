// components/checkout/PaymentForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import { useState } from "react";

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
      description: "Pay with Visa, Mastercard, or American Express",
    },
    {
      id: "paypal",
      label: "PayPal",
      icon: Wallet,
      description: "Pay securely with your PayPal account",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive your order",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod) {
      onSubmit(selectedMethod);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Payment Method</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how you&apos;d like to pay for your order
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                htmlFor={method.id}
                className={`flex items-start gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id={method.id}
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <method.icon
                      className={`h-5 w-5 ${
                        selectedMethod === method.id
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="font-semibold text-base">
                      {method.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1"
              size="lg"
            >
              Back to Shipping
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!selectedMethod}
              size="lg"
            >
              Review Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
