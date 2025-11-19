// components/checkout/CheckoutSteps.tsx
import { Check, MapPin, CreditCard, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Shipping", icon: MapPin },
  { number: 2, title: "Payment", icon: CreditCard },
  { number: 3, title: "Review", icon: ClipboardCheck },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-16 px-4">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step: Icon and absolutely positioned title */}
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out border-2",
                  currentStep > step.number
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                    : currentStep === step.number
                    ? "bg-white border-slate-900 text-slate-900 shadow-xl ring-4 ring-slate-200/50"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                )}
                aria-current={currentStep === step.number ? "step" : undefined}
              >
                {currentStep > step.number ? (
                  <Check className="h-7 w-7" strokeWidth={3} />
                ) : (
                  <step.icon className="h-7 w-7" strokeWidth={1.5} />
                )}
              </div>
              {/* Title is positioned absolutely to not interfere with flexbox alignment */}
              <p
                className={cn(
                  "absolute top-16 text-base font-semibold transition-colors duration-300 w-max hidden sm:block",
                  currentStep >= step.number
                    ? "text-slate-900"
                    : "text-slate-400"
                )}
              >
                {step.title}
              </p>
            </div>

            {/* Connector Line: Renders between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-4 relative bg-slate-200 rounded-full">
                <div
                  className="absolute top-0 left-0 h-1 bg-slate-900 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: currentStep > step.number ? "100%" : "0%" }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
