// components/products/admin/ProductRow.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import Image from "next/image";
import { RowActions } from "./RowActions";
import { cn, getImageSrc } from "@/lib/utils";
import { Star } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onAdjustStock: (product: Product) => void;
}

export function ProductRow({
  product,
  isSelected,
  onToggleSelect,
  onAdjustStock,
}: ProductRowProps) {
  const brandName = useMemo(
    () => (typeof product.brand === "object" ? product.brand?.name : "N/A"),
    [product.brand]
  );
  const finalPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;

  return (
    <TableRow
      className={cn(
        "border-b border-gray-200 transition-colors",
        isSelected ? "bg-gray-50" : "hover:bg-gray-50/50"
      )}
      data-state={isSelected && "selected"}
    >
      <TableCell className="px-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(product._id)}
          aria-label={`Select ${product.name}`}
          className="rounded-none border-gray-300"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative bg-white border border-gray-200 rounded-none overflow-hidden flex-shrink-0">
            <Image
              src={getImageSrc(product.mainImage)}
              alt={product.name}
              fill
              className="object-cover p-1"
              sizes="48px"
            />
          </div>
          <div>
            <Link
              href={`/admin/products/${product._id}/edit`}
              className="font-semibold text-sm text-gray-900 hover:text-gray-700 transition-colors"
            >
              {product.name}
            </Link>
            <p className="text-xs text-gray-500 mt-0.5">{brandName}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="font-semibold text-sm text-gray-900">
          ${finalPrice.toFixed(2)}
        </div>
        {product.onSale && (
          <div className="text-xs text-gray-400 line-through">
            ${product.price.toFixed(2)}
          </div>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant="secondary"
          className={cn(
            "font-medium rounded-none px-2.5 py-0.5 text-xs",
            product.countInStock > 10
              ? "bg-white text-gray-900 border border-gray-200"
              : product.countInStock > 0
              ? "bg-gray-100 text-gray-700 border border-gray-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          )}
        >
          {product.countInStock}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-gray-400 fill-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {new Date(product.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </TableCell>
      <TableCell className="text-right pr-4">
        <RowActions product={product} onAdjustStock={onAdjustStock} />
      </TableCell>
    </TableRow>
  );
}
