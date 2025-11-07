// src/components/products/product-page/SectionContainer.tsx
import { ReactNode } from "react";
import { AccordionItem } from "@/components/ui/accordion";

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  value: string;
}

export function SectionContainer({
  children,
  id,
  value,
}: SectionContainerProps) {
  return (
    <AccordionItem
      value={value}
      id={id}
      className="bg-white border-b border-gray-200 last:border-b-0"
    >
      {children}
    </AccordionItem>
  );
}
