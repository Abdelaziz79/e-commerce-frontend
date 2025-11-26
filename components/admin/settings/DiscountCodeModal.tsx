// components/admin/settings/DiscountCodeModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddDiscountCode,
  useUpdateDiscountCode,
} from "@/hooks/use-admin-settings-hooks";
import { CreateDiscountCodeData, DiscountCode } from "@/types/adminSettings";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DiscountCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDiscountCode: DiscountCode | null;
}

export function DiscountCodeModal({
  isOpen,
  onClose,
  editingDiscountCode,
}: DiscountCodeModalProps) {
  const addMutation = useAddDiscountCode();
  const updateMutation = useUpdateDiscountCode();

  const [formData, setFormData] = useState<CreateDiscountCodeData>({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: undefined,
    usageLimit: undefined,
    perUserLimit: undefined,
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    applicableCategories: [],
    applicableProducts: [],
    excludedCategories: [],
    excludedProducts: [],
    isActive: true,
  });

  useEffect(() => {
    if (editingDiscountCode) {
      setFormData({
        code: editingDiscountCode.code,
        description: editingDiscountCode.description || "",
        type: editingDiscountCode.type,
        value: editingDiscountCode.value,
        minOrderAmount: editingDiscountCode.minOrderAmount,
        maxDiscountAmount: editingDiscountCode.maxDiscountAmount,
        usageLimit: editingDiscountCode.usageLimit,
        perUserLimit: editingDiscountCode.perUserLimit,
        validFrom: new Date(editingDiscountCode.validFrom)
          .toISOString()
          .split("T")[0],
        validUntil: new Date(editingDiscountCode.validUntil)
          .toISOString()
          .split("T")[0],
        applicableCategories: editingDiscountCode.applicableCategories || [],
        applicableProducts: editingDiscountCode.applicableProducts || [],
        excludedCategories: editingDiscountCode.excludedCategories || [],
        excludedProducts: editingDiscountCode.excludedProducts || [],
        isActive: editingDiscountCode.isActive,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        type: "percentage",
        value: 0,
        minOrderAmount: 0,
        maxDiscountAmount: undefined,
        usageLimit: undefined,
        perUserLimit: undefined,
        validFrom: new Date().toISOString().split("T")[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        applicableCategories: [],
        applicableProducts: [],
        excludedCategories: [],
        excludedProducts: [],
        isActive: true,
      });
    }
  }, [editingDiscountCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDiscountCode) {
        await updateMutation.mutateAsync({
          discountCodeId: editingDiscountCode._id,
          data: formData,
        });
      } else {
        await addMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editingDiscountCode ? "Edit Discount Code" : "Add Discount Code"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {editingDiscountCode
              ? "Update the discount code configuration"
              : "Create a new promotional discount code"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-xs font-medium text-gray-700"
                >
                  Discount Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="SAVE20"
                  className="h-9 text-sm border-gray-200 rounded-none font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-xs font-medium text-gray-700"
                >
                  Discount Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="h-9 rounded-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Optional description"
                rows={2}
                className="resize-none border-gray-200 text-sm rounded-none"
              />
            </div>
          </div>

          {/* Discount Value */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Discount Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="value"
                  className="text-xs font-medium text-gray-700"
                >
                  Discount Value <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    {formData.type === "percentage" ? "%" : "$"}
                  </span>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    max={formData.type === "percentage" ? "100" : undefined}
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="pl-7 h-9 text-sm border-gray-200 bg-white rounded-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="minOrderAmount"
                  className="text-xs font-medium text-gray-700"
                >
                  Min Order Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="pl-7 h-9 text-sm border-gray-200 bg-white rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="maxDiscountAmount"
                  className="text-xs font-medium text-gray-700"
                >
                  Max Discount (Optional)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscountAmount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxDiscountAmount: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="No limit"
                    className="pl-7 h-9 text-sm border-gray-200 bg-white rounded-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Usage Limits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="usageLimit"
                  className="text-xs font-medium text-gray-700"
                >
                  Total Usage Limit (Optional)
                </Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimit: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Unlimited"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="perUserLimit"
                  className="text-xs font-medium text-gray-700"
                >
                  Per User Limit (Optional)
                </Label>
                <Input
                  id="perUserLimit"
                  type="number"
                  min="1"
                  value={formData.perUserLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      perUserLimit: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="Unlimited"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Validity Period
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="validFrom"
                  className="text-xs font-medium text-gray-700"
                >
                  Valid From <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="validUntil"
                  className="text-xs font-medium text-gray-700"
                >
                  Valid Until <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  min={formData.validFrom}
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Note about Product/Category IDs */}
          <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-800">
            <p className="font-medium mb-1">Note:</p>
            <p>
              To restrict this discount to specific products or categories,
              you&apos;ll need to enter their IDs (comma-separated). Leave empty
              to apply to all items.
            </p>
          </div>

          {/* Applicable Items (Optional) */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Applicable Items (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="applicableCategories"
                  className="text-xs font-medium text-gray-700"
                >
                  Category IDs
                </Label>
                <Input
                  id="applicableCategories"
                  value={formData.applicableCategories?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicableCategories: e.target.value
                        ? e.target.value.split(",").map((id) => id.trim())
                        : [],
                    })
                  }
                  placeholder="cat1, cat2, cat3"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="applicableProducts"
                  className="text-xs font-medium text-gray-700"
                >
                  Product IDs
                </Label>
                <Input
                  id="applicableProducts"
                  value={formData.applicableProducts?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicableProducts: e.target.value
                        ? e.target.value.split(",").map((id) => id.trim())
                        : [],
                    })
                  }
                  placeholder="prod1, prod2, prod3"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Excluded Items (Optional) */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Excluded Items (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="excludedCategories"
                  className="text-xs font-medium text-gray-700"
                >
                  Category IDs
                </Label>
                <Input
                  id="excludedCategories"
                  value={formData.excludedCategories?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excludedCategories: e.target.value
                        ? e.target.value.split(",").map((id) => id.trim())
                        : [],
                    })
                  }
                  placeholder="cat1, cat2, cat3"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="excludedProducts"
                  className="text-xs font-medium text-gray-700"
                >
                  Product IDs
                </Label>
                <Input
                  id="excludedProducts"
                  value={formData.excludedProducts?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excludedProducts: e.target.value
                        ? e.target.value.split(",").map((id) => id.trim())
                        : [],
                    })
                  }
                  placeholder="prod1, prod2, prod3"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <Label
              htmlFor="isActive"
              className="text-xs font-medium text-gray-900 cursor-pointer"
            >
              Active
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-none">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingDiscountCode ? "Updating..." : "Adding..."}
                </>
              ) : editingDiscountCode ? (
                "Update Discount Code"
              ) : (
                "Add Discount Code"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
