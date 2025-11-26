// components/admin/settings/ShippingRateModal.tsx
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
  useAddShippingRate,
  useUpdateShippingRate,
} from "@/hooks/use-admin-settings-hooks";
import {
  CreateShippingRateData,
  PriceRange,
  ShippingRate,
  WeightRange,
} from "@/types/adminSettings";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ShippingRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingShippingRate: ShippingRate | null;
}

export function ShippingRateModal({
  isOpen,
  onClose,
  editingShippingRate,
}: ShippingRateModalProps) {
  const addMutation = useAddShippingRate();
  const updateMutation = useUpdateShippingRate();

  const [formData, setFormData] = useState<CreateShippingRateData>({
    name: "",
    description: "",
    type: "flat",
    flatRate: 0,
    freeShippingThreshold: undefined,
    weightRanges: [],
    priceRanges: [],
    isActive: true,
  });

  useEffect(() => {
    if (editingShippingRate) {
      setFormData({
        name: editingShippingRate.name,
        description: editingShippingRate.description || "",
        type: editingShippingRate.type,
        flatRate: editingShippingRate.flatRate,
        freeShippingThreshold: editingShippingRate.freeShippingThreshold,
        weightRanges: editingShippingRate.weightRanges || [],
        priceRanges: editingShippingRate.priceRanges || [],
        isActive: editingShippingRate.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        type: "flat",
        flatRate: 0,
        freeShippingThreshold: undefined,
        weightRanges: [],
        priceRanges: [],
        isActive: true,
      });
    }
  }, [editingShippingRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingShippingRate) {
        await updateMutation.mutateAsync({
          shippingRateId: editingShippingRate._id,
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

  const handleAddWeightRange = () => {
    setFormData({
      ...formData,
      weightRanges: [
        ...(formData.weightRanges || []),
        { minWeight: 0, maxWeight: 0, rate: 0 },
      ],
    });
  };

  const handleUpdateWeightRange = (
    index: number,
    field: keyof WeightRange,
    value: number
  ) => {
    const updatedRanges = [...(formData.weightRanges || [])];
    updatedRanges[index] = { ...updatedRanges[index], [field]: value };
    setFormData({ ...formData, weightRanges: updatedRanges });
  };

  const handleRemoveWeightRange = (index: number) => {
    setFormData({
      ...formData,
      weightRanges: formData.weightRanges?.filter((_, i) => i !== index) || [],
    });
  };

  const handleAddPriceRange = () => {
    setFormData({
      ...formData,
      priceRanges: [
        ...(formData.priceRanges || []),
        { minPrice: 0, maxPrice: 0, rate: 0 },
      ],
    });
  };

  const handleUpdatePriceRange = (
    index: number,
    field: keyof PriceRange,
    value: number
  ) => {
    const updatedRanges = [...(formData.priceRanges || [])];
    updatedRanges[index] = { ...updatedRanges[index], [field]: value };
    setFormData({ ...formData, priceRanges: updatedRanges });
  };

  const handleRemovePriceRange = (index: number) => {
    setFormData({
      ...formData,
      priceRanges: formData.priceRanges?.filter((_, i) => i !== index) || [],
    });
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editingShippingRate ? "Edit Shipping Rate" : "Add Shipping Rate"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {editingShippingRate
              ? "Update the shipping rate configuration"
              : "Configure a new shipping rate for your store"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-medium text-gray-700"
                >
                  Shipping Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Standard Shipping"
                  className="h-9 text-sm border-gray-200 rounded-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="type"
                  className="text-xs font-medium text-gray-700"
                >
                  Shipping Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(
                    value: "flat" | "weight-based" | "price-based"
                  ) =>
                    setFormData({
                      ...formData,
                      type: value,
                      weightRanges:
                        value === "weight-based" ? formData.weightRanges : [],
                      priceRanges:
                        value === "price-based" ? formData.priceRanges : [],
                      flatRate:
                        value === "flat" ? formData.flatRate : undefined,
                    })
                  }
                >
                  <SelectTrigger className="h-9 rounded-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                    <SelectItem value="weight-based">Weight-Based</SelectItem>
                    <SelectItem value="price-based">Price-Based</SelectItem>
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

          {/* Flat Rate Configuration */}
          {formData.type === "flat" && (
            <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
              <h4 className="text-xs font-semibold text-gray-900">
                Flat Rate Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="flatRate"
                    className="text-xs font-medium text-gray-700"
                  >
                    Shipping Cost <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <Input
                      id="flatRate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.flatRate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          flatRate: parseFloat(e.target.value) || 0,
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
                    htmlFor="freeShippingThreshold"
                    className="text-xs font-medium text-gray-700"
                  >
                    Free Shipping Over (Optional)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.freeShippingThreshold || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          freeShippingThreshold: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="No threshold"
                      className="pl-7 h-9 text-sm border-gray-200 bg-white rounded-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weight-Based Configuration */}
          {formData.type === "weight-based" && (
            <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-900">
                  Weight Ranges
                </h4>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddWeightRange}
                  className="h-8 text-xs rounded-none"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Range
                </Button>
              </div>

              {formData.weightRanges && formData.weightRanges.length > 0 ? (
                <div className="space-y-3">
                  {formData.weightRanges.map((range, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white border border-gray-200"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Min Weight (kg)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.minWeight}
                          onChange={(e) =>
                            handleUpdateWeightRange(
                              index,
                              "minWeight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Max Weight (kg)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.maxWeight}
                          onChange={(e) =>
                            handleUpdateWeightRange(
                              index,
                              "maxWeight",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Rate ($)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.rate}
                          onChange={(e) =>
                            handleUpdateWeightRange(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveWeightRange(index)}
                          className="h-8 w-full rounded-none"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  No weight ranges added. Click &quot;Add Range&quot; to get
                  started.
                </p>
              )}
            </div>
          )}

          {/* Price-Based Configuration */}
          {formData.type === "price-based" && (
            <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-gray-900">
                  Price Ranges
                </h4>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddPriceRange}
                  className="h-8 text-xs rounded-none"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Range
                </Button>
              </div>

              {formData.priceRanges && formData.priceRanges.length > 0 ? (
                <div className="space-y-3">
                  {formData.priceRanges.map((range, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white border border-gray-200"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Min Price ($)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.minPrice}
                          onChange={(e) =>
                            handleUpdatePriceRange(
                              index,
                              "minPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Max Price ($)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.maxPrice}
                          onChange={(e) =>
                            handleUpdatePriceRange(
                              index,
                              "maxPrice",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">
                          Rate ($)
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={range.rate}
                          onChange={(e) =>
                            handleUpdatePriceRange(
                              index,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm rounded-none"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemovePriceRange(index)}
                          className="h-8 w-full rounded-none"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  No price ranges added. Click &quot;Add Range&quot; to get
                  started.
                </p>
              )}
            </div>
          )}

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
                  {editingShippingRate ? "Updating..." : "Adding..."}
                </>
              ) : editingShippingRate ? (
                "Update Shipping Rate"
              ) : (
                "Add Shipping Rate"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
