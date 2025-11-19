// components/products/admin/StatCards.tsx
"use client";

import StatCard from "@/components/shared/StatCard";
import { useProductStockStatus } from "@/hooks/use-admin-products";
import { ArchiveX, Package, Star } from "lucide-react";

export function StatCards() {
  const { totalProducts, outOfStockCount, featuredCount, isLoading } =
    useProductStockStatus();

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
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
        title="Featured"
        value={featuredCount.toLocaleString()}
        icon={Star}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
    </div>
  );
}
