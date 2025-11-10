// components/products/admin/RowActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProduct } from "@/hooks/use-product-mutations";
import { MoreHorizontal, Edit, Trash2, Eye, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/types/product";

interface RowActionsProps {
  product: Product;
  onAdjustStock: (product: Product) => void;
}

export function RowActions({ product, onAdjustStock }: RowActionsProps) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    toast("Are you sure?", {
      description: `This will permanently delete "${product.name}". This action cannot be undone.`,
      action: {
        label: "Delete",
        onClick: () => deleteProduct(product._id),
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
      classNames: {
        actionButton: "bg-red-600 text-white",
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={`/products/${product._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View on Store
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/products/${product._id}/edit`}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdjustStock(product)}>
          <Package className="mr-2 h-4 w-4" />
          Adjust Stock
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
