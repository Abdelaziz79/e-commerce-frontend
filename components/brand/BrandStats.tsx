// ===== components/brand/BrandStats.tsx =====
import { Card } from "@/components/ui/card";
import { Package, CheckCircle, Star } from "lucide-react";

interface BrandStatsProps {
  totalBrands: number;
}

export function BrandStats({ totalBrands }: BrandStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card className="p-4 border-0 bg-muted/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            Total Brands
          </p>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-semibold tabular-nums mt-1">
          {totalBrands}
        </p>
      </Card>

      {/* Placeholder stat cards - can be replaced with real data if available from API */}
      <Card className="p-4 border-0 bg-muted/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Active</p>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-semibold tabular-nums mt-1">
          {/* This would require backend data */}
          {totalBrands}
        </p>
      </Card>

      <Card className="p-4 border-0 bg-muted/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Featured</p>
          <Star className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-2xl font-semibold tabular-nums mt-1">
          {/* This would require backend data */}0
        </p>
      </Card>
    </div>
  );
}
