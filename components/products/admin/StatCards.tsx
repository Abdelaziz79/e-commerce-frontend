// components/products/admin/StatCards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductStockStatus } from "@/hooks/use-admin-products";
import { Archive, ArchiveX, Package, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading?: boolean;
  iconColor?: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
  iconColor = "text-gray-500",
}: StatCardProps) {
  return (
    <Card className="bg-white rounded-none border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCards() {
  const {
    totalProducts,
    outOfStockCount,
    lowStockCount,
    featuredCount,
    isLoading,
  } = useProductStockStatus();

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Products"
        value={totalProducts.toLocaleString()}
        icon={Package}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Out of Stock"
        value={outOfStockCount.toLocaleString()}
        icon={ArchiveX}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Low Stock"
        value={lowStockCount.toLocaleString()}
        icon={Archive}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Featured"
        value={featuredCount.toLocaleString()}
        icon={Star}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
    </div>
  );
}
