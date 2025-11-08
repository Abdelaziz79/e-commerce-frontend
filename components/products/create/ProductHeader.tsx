// app/admin/products/create/components/ProductHeader.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";

export function ProductHeader() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="ghost" size="sm" className="hover:bg-gray-100">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div className="border-b pb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Create New Product
            </h1>
            <p className="text-gray-600 text-base">
              Fill in the information below to add a new product to your
              inventory. All required fields are marked with{" "}
              <span className="text-red-500">*</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
