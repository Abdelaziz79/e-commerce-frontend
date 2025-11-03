// components/checkout/CheckoutSteps.tsx
import { Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { number: 1, title: "Shipping" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Review" },
  ];

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-green-500 text-white scale-100"
                  : currentStep === step.number
                  ? "bg-primary text-white scale-110"
                  : "bg-white text-gray-400 border-2 border-gray-300"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-6 w-6" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`mt-2 text-sm font-semibold transition-colors ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-20 md:w-32 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step.number ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
