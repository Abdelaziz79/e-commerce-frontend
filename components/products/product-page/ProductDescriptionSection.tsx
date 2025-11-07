// src/components/products/product-page/ProductDescriptionSection.tsx
import { AccordionContent } from "@/components/ui/accordion";
import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "./SectionHeader";
import { FileText } from "lucide-react";

interface DescriptionSectionProps {
  description: string;
  richDescription?: string;
}

export function ProductDescriptionSection({
  description,
  richDescription,
}: DescriptionSectionProps) {
  return (
    <SectionContainer value="description">
      <SectionHeader icon={FileText} title="Description" />
      <AccordionContent className="px-5 pb-5 pt-1">
        <div
          className="prose max-w-none text-gray-600 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: richDescription || `<p>${description}</p>`,
          }}
        />
      </AccordionContent>
    </SectionContainer>
  );
}
