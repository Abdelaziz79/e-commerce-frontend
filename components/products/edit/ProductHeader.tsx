// components/products/edit/ProductHeader.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProductHeaderProps {
  productName: string;
  productId: string;
}

export function ProductHeader({ productName, productId }: ProductHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-5">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs h-8 hover:bg-gray-100"
        >
          <Link href="/admin/products">
            <ArrowLeft className="h-3 w-3 mr-1.5" />
            Back to Products
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-xs h-8 hover:bg-gray-100"
        >
          <Link href={`/products/${productId}`}>View Product</Link>
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-sm text-gray-600">
          Update the information below to modify{" "}
          <span className="font-semibold text-gray-900">{productName}</span>.
          Fields marked with <span className="text-red-500">*</span> are
          required.
        </p>
      </div>
    </div>
  );
}
