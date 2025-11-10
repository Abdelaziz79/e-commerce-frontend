// app/admin/products/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/hooks/use-product-mutations";
import { Edit, Loader2, Trash2, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StockAdjustmentDialog } from "@/components/products/admin/StockAdjustmentDialog";
import { useState } from "react";
import { Product } from "@/types/product";

export default function AdminProductActions({
  productId,
  product,
}: {
  productId: string;
  product: Product;
}) {
  const router = useRouter();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  const handleDelete = () => {
    toast("Are you sure?", {
      description: `This will permanently delete "${product.name}". This action cannot be undone.`,
      action: {
        label: "Delete",
        onClick: () =>
          deleteProduct(productId, {
            onSuccess: () => {
              router.push("/admin/products");
            },
          }),
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

  const handleAdjustStock = () => {
    setIsStockDialogOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white border border-gray-200 shadow-lg p-3 rounded-none">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Admin Mode
          </span>
        </div>

        <div className="h-6 w-px bg-gray-200"></div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 text-sm rounded-none border-gray-200 hover:bg-gray-100"
        >
          <Link href={`/admin/products/${productId}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAdjustStock}
          className="h-9 text-sm rounded-none border-gray-200 hover:bg-gray-100"
        >
          <Package className="h-4 w-4 mr-2" />
          Adjust Stock
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="h-9 text-sm rounded-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </div>

      <StockAdjustmentDialog
        product={product}
        open={isStockDialogOpen}
        onOpenChange={setIsStockDialogOpen}
      />
    </>
  );
}
