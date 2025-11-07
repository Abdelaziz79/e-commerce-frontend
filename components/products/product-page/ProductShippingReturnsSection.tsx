// src/components/products/product-page/ProductShippingReturnsSection.tsx
import { RotateCcw, ShieldCheck, Truck, Package } from "lucide-react";
import { AccordionContent } from "@/components/ui/accordion";
import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "./SectionHeader";

interface ShippingReturnsSectionProps {
  warranty?: string;
}

export function ProductShippingReturnsSection({
  warranty,
}: ShippingReturnsSectionProps) {
  return (
    <SectionContainer value="shipping-returns">
      <SectionHeader icon={Package} title="Shipping & Returns" />
      <AccordionContent className="px-5 pb-5 pt-1">
        <div className="space-y-5">
          {/* Shipping */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Truck className="mr-2 h-3.5 w-3.5 text-gray-500" />
              Shipping
            </h3>
            <div className="space-y-3 text-sm text-gray-600 ml-5">
              <div>
                <p className="font-medium text-gray-900">Standard Shipping</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Free for orders over $50 · 3-5 business days
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Express Shipping</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  $12.99 · 1-2 business days
                </p>
              </div>
              <p className="text-gray-500 text-xs pt-1">
                Orders processed within 24-48 hours. Tracking info sent via
                email.
              </p>
            </div>
          </div>

          {/* Returns */}
          <div className="pt-3 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <RotateCcw className="mr-2 h-3.5 w-3.5 text-gray-500" />
              Returns
            </h3>
            <div className="space-y-2 text-sm text-gray-600 ml-5">
              <p>30-day return policy for full refund</p>
              <ul className="space-y-1 text-xs text-gray-500">
                <li>• Items must be unused with original packaging</li>
                <li>• Contact support to initiate return</li>
                <li>• Refunds processed within 5-7 business days</li>
              </ul>
            </div>
          </div>

          {warranty && (
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <ShieldCheck className="mr-2 h-3.5 w-3.5 text-gray-500" />
                Warranty
              </h3>
              <p className="text-sm text-gray-600 ml-5">{warranty}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </SectionContainer>
  );
}
