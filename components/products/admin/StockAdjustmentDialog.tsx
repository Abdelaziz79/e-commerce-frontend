// components/products/admin/StockAdjustmentDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdjustProductStock } from "@/hooks/use-product-mutations";
import { Product } from "@/types/product";
import { Loader2, Minus, Package, Plus } from "lucide-react";
import { useState } from "react";

interface StockAdjustmentDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({
  product,
  open,
  onOpenChange,
}: StockAdjustmentDialogProps) {
  const [adjustment, setAdjustment] = useState<string>("");
  const [reason, setReason] = useState("");
  const { mutate: adjustStock, isPending } = useAdjustProductStock();

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      // Reset form when closing
      setAdjustment("");
      setReason("");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !adjustment) return;

    const adjustmentValue = parseInt(adjustment);
    if (isNaN(adjustmentValue) || adjustmentValue === 0) return;

    adjustStock(
      {
        productId: product._id,
        data: {
          adjustment: adjustmentValue,
          reason: reason.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          // Close dialog after a brief delay to prevent freezing
          setTimeout(() => {
            handleOpenChange(false);
          }, 100);
        },
      }
    );
  };

  const quickAdjust = (value: number) => {
    const current = parseInt(adjustment) || 0;
    const newValue = current + value;
    setAdjustment(newValue.toString());
  };

  const newStock = product
    ? product.countInStock + (parseInt(adjustment) || 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Adjust Stock Level
          </DialogTitle>
          <DialogDescription>
            Update the inventory count for{" "}
            <span className="font-medium text-gray-900">{product?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Stock Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {product?.countInStock || 0}
                </p>
              </div>
              {adjustment && (
                <>
                  <div className="text-gray-400">→</div>
                  <div>
                    <p className="text-sm text-gray-600">New Stock</p>
                    <p
                      className={`text-2xl font-bold ${
                        newStock < 0
                          ? "text-red-600"
                          : newStock > (product?.countInStock || 0)
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {newStock}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Adjustment Input */}
          <div className="space-y-2">
            <Label htmlFor="adjustment">
              Adjustment Amount{" "}
              <span className="text-gray-500 font-normal">
                (use + or - to add/remove)
              </span>
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  id="adjustment"
                  type="text"
                  placeholder="e.g., +10 or -5"
                  value={adjustment}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || value === "+" || value === "-") {
                      setAdjustment(value);
                    } else if (/^[+-]?\d+$/.test(value)) {
                      setAdjustment(value);
                    }
                  }}
                  className="pr-20"
                  disabled={isPending}
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => quickAdjust(-1)}
                    disabled={isPending}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={() => quickAdjust(1)}
                    disabled={isPending}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Adjustment Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAdjustment("-10")}
                disabled={isPending}
                className="flex-1"
              >
                -10
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAdjustment("-5")}
                disabled={isPending}
                className="flex-1"
              >
                -5
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAdjustment("+5")}
                disabled={isPending}
                className="flex-1"
              >
                +5
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setAdjustment("+10")}
                disabled={isPending}
                className="flex-1"
              >
                +10
              </Button>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason{" "}
              <span className="text-gray-500 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Received new shipment, Damaged items removed, Inventory correction..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </div>

          {/* Warning for negative stock */}
          {newStock < 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              Warning: This adjustment will result in negative stock ({newStock}
              ). Please verify this is correct.
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !adjustment || parseInt(adjustment) === 0}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adjust Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
