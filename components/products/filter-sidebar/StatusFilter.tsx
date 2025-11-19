// components/products/filter-sidebar/StatusFilter.tsx
"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Star, Zap } from "lucide-react";

interface StatusFilterProps {
  featured: boolean;
  onSale: boolean;
  onToggleFeatured: (val: boolean) => void;
  onToggleOnSale: (val: boolean) => void;
}

export function StatusFilter({
  featured,
  onSale,
  onToggleFeatured,
  onToggleOnSale,
}: StatusFilterProps) {
  return (
    <div className="space-y-4 px-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="featured-filter"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Featured
          </Label>
        </div>
        <Switch
          id="featured-filter"
          checked={featured}
          onCheckedChange={onToggleFeatured}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="sale-filter"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            On Sale
          </Label>
        </div>
        <Switch
          id="sale-filter"
          checked={onSale}
          onCheckedChange={onToggleOnSale}
        />
      </div>
    </div>
  );
}
