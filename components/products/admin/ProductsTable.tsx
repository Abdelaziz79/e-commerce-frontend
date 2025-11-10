// components/products/admin/ProductsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductRow } from "./ProductRow";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  isAllSelected: boolean;
  sort: string;
  onSortChange: (sort: string) => void;
  isMutating: boolean;
  onAdjustStock: (product: Product) => void;
}

export function ProductsTable({
  products,
  selectedProductIds,
  onSelectAll,
  onToggleSelect,
  isAllSelected,
  sort,
  onSortChange,
  isMutating,
  onAdjustStock,
}: ProductsTableProps) {
  const handleSort = (field: string) => {
    const isCurrentlyAsc = sort === field;
    const isCurrentlyDesc = sort === `-${field}`;

    if (isCurrentlyDesc) {
      onSortChange(field);
    } else if (isCurrentlyAsc) {
      onSortChange(`-${field}`);
    } else {
      onSortChange(field);
    }
  };

  const SortableHeader = ({
    field,
    label,
    className,
  }: {
    field: string;
    label: string;
    className?: string;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className={cn(
        "h-8 px-2 -ml-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 hover:bg-gray-50",
        className
      )}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow>
            <TableHead className="w-[50px] px-4">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                aria-label="Select all"
                className="rounded-none border-gray-300"
              />
            </TableHead>
            <TableHead className="min-w-[300px]">
              <SortableHeader field="name" label="Product" />
            </TableHead>
            <TableHead className="text-right">
              <SortableHeader field="price" label="Price" />
            </TableHead>
            <TableHead className="text-center">
              <SortableHeader field="countInStock" label="Stock" />
            </TableHead>
            <TableHead>
              <SortableHeader field="rating" label="Rating" />
            </TableHead>
            <TableHead>
              <SortableHeader field="createdAt" label="Date" />
            </TableHead>
            <TableHead className="w-[50px] text-right pr-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          className={cn(isMutating && "opacity-50 transition-opacity")}
        >
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              isSelected={selectedProductIds.includes(product._id)}
              onToggleSelect={onToggleSelect}
              onAdjustStock={onAdjustStock}
            />
          ))}
        </TableBody>
      </Table>
      {!isMutating && products.length === 0 && (
        <div className="text-center p-12 text-sm text-gray-500 border-t border-gray-200">
          <PackageX className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h4 className="font-semibold text-gray-800 text-base">
            No products found
          </h4>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
