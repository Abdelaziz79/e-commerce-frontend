// components/products/admin/ProductsHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Plus } from "lucide-react";
import Link from "next/link";

interface ProductsHeaderProps {
  productCount?: number;
}

export function ProductsHeader({ productCount }: ProductsHeaderProps) {
  return (
    <div className="space-y-4">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="text-xs h-8 hover:bg-gray-100"
      >
        <Link href="/admin">
          <ArrowLeft className="h-3 w-3 mr-1.5" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          {productCount !== undefined && (
            <p className="text-sm text-gray-600">
              Manage your inventory • {productCount.toLocaleString()} items
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="h-9 text-sm rounded-none bg-gray-900 hover:bg-gray-800"
          >
            <Link href="/admin/products/create">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
