// src/components/products/product-page/ProductSpecificationsSection.tsx
import { ListChecks } from "lucide-react";
import { AccordionContent } from "@/components/ui/accordion";
import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "./SectionHeader";

interface SpecificationsSectionProps {
  attributes: Record<string, string> | undefined;
}

export function ProductSpecificationsSection({
  attributes,
}: SpecificationsSectionProps) {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  return (
    <SectionContainer value="specifications">
      <SectionHeader icon={ListChecks} title="Specifications" />
      <AccordionContent className="px-4 sm:px-5 pb-5 pt-1">
        <dl className="space-y-0 divide-y divide-gray-100">
          {Object.entries(attributes).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 py-3 first:pt-0"
            >
              <dt className="text-sm text-gray-600 capitalize font-medium sm:font-normal flex-shrink-0 sm:min-w-[180px]">
                {key.replace(/_/g, " ")}
              </dt>
              <dd className="text-sm text-gray-900 font-medium sm:text-right break-words">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </AccordionContent>
    </SectionContainer>
  );
}
