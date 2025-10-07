// src/components/products/product-page/ProductBreadcrumb.tsx
import { Category } from "@/types/category";
import Link from "next/link";

interface ProductBreadcrumbProps {
  category?: Category;
  productName: string;
}

export function ProductBreadcrumb({
  category,
  productName,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex mb-8 text-sm">
      <ol className="flex items-center space-x-2 text-gray-500">
        <li>
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          <Link href="/products" className="hover:text-black transition-colors">
            Products
          </Link>
        </li>
        {category && (
          <>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            </li>
          </>
        )}
        <li>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-800 font-medium truncate max-w-xs">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
