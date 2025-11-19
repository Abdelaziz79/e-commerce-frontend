// src/components/products/product-page/ProductBreadcrumb.tsx
import { Category } from "@/types/category";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  category?: Category;
  productName: string;
}

export function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav className="mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
        </li>

        <ChevronRight className="w-4 h-4 text-gray-400" />

        <li>
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Products
          </Link>
        </li>

        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <li>
              <Link
                href={`/categories/${category?.slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {category?.name}
              </Link>
            </li>
          </>
        )}

        <ChevronRight className="w-4 h-4 text-gray-400" />

        <li className="text-gray-900 font-medium truncate max-w-[300px]">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
