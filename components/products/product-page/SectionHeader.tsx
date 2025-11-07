// src/components/products/product-page/SectionHeader.tsx
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { AccordionTrigger } from "@/components/ui/accordion";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string | ReactNode;
  children?: ReactNode;
}

export function SectionHeader({
  icon: Icon,
  title,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <AccordionTrigger className="flex items-center gap-3 hover:no-underline flex-1 py-4 px-5 [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center gap-3 flex-1">
          <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
      </AccordionTrigger>
      {children && <div className="mr-5">{children}</div>}
    </div>
  );
}
