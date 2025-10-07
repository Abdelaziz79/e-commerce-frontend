// app/admin/products/add/components/ProductHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProductHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      <p className="text-gray-600 mt-3">Create a new product for your store</p>
    </div>
  );
}
