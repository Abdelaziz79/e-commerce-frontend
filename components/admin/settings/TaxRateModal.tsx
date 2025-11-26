// components/admin/settings/TaxRateModal.tsx
"use client";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddTaxRate,
  useUpdateTaxRate,
} from "@/hooks/use-admin-settings-hooks";
import { CreateTaxRateData, TaxRate } from "@/types/adminSettings";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TaxRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTaxRate: TaxRate | null;
}

export function TaxRateModal({
  isOpen,
  onClose,
  editingTaxRate,
}: TaxRateModalProps) {
  const addMutation = useAddTaxRate();
  const updateMutation = useUpdateTaxRate();

  const [formData, setFormData] = useState<CreateTaxRateData>({
    name: "",
    rate: 0,
    description: "",
    country: "",
    state: "",
    city: "",
    postalCodes: [],
    isDefault: false,
    isActive: true,
    priority: 0,
  });

  const [currentPostalCode, setCurrentPostalCode] = useState("");

  useEffect(() => {
    if (editingTaxRate) {
      setFormData({
        name: editingTaxRate.name,
        rate: editingTaxRate.rate,
        description: editingTaxRate.description || "",
        country: editingTaxRate.country || "",
        state: editingTaxRate.state || "",
        city: editingTaxRate.city || "",
        postalCodes: editingTaxRate.postalCodes || [],
        isDefault: editingTaxRate.isDefault,
        isActive: editingTaxRate.isActive,
        priority: editingTaxRate.priority,
      });
    } else {
      setFormData({
        name: "",
        rate: 0,
        description: "",
        country: "",
        state: "",
        city: "",
        postalCodes: [],
        isDefault: false,
        isActive: true,
        priority: 0,
      });
    }
  }, [editingTaxRate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTaxRate) {
        await updateMutation.mutateAsync({
          taxRateId: editingTaxRate._id,
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

  const handleAddPostalCode = () => {
    const trimmed = currentPostalCode.trim();
    if (trimmed && !formData.postalCodes?.includes(trimmed)) {
      setFormData({
        ...formData,
        postalCodes: [...(formData.postalCodes || []), trimmed],
      });
      setCurrentPostalCode("");
    }
  };

  const handleRemovePostalCode = (code: string) => {
    setFormData({
      ...formData,
      postalCodes: formData.postalCodes?.filter((c) => c !== code) || [],
    });
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editingTaxRate ? "Edit Tax Rate" : "Add Tax Rate"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {editingTaxRate
              ? "Update the tax rate configuration"
              : "Configure a new tax rate for your store"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium text-gray-700"
              >
                Tax Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., California Sales Tax"
                className="h-9 text-sm border-gray-200 rounded-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rate"
                className="text-xs font-medium text-gray-700"
              >
                Tax Rate (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="7.25"
                className="h-9 text-sm border-gray-200 rounded-none"
                required
              />
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

          {/* Location */}
          <div className="space-y-4 p-4 border border-gray-200 bg-gray-50">
            <h4 className="text-xs font-semibold text-gray-900">
              Location (Optional)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-xs font-medium text-gray-700"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="USA"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="text-xs font-medium text-gray-700"
                >
                  State/Province
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  placeholder="California"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-xs font-medium text-gray-700"
                >
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Los Angeles"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>
            </div>

            {/* Postal Codes */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">
                Postal Codes
              </Label>
              <div className="flex gap-2">
                <Input
                  value={currentPostalCode}
                  onChange={(e) => setCurrentPostalCode(e.target.value)}
                  placeholder="Add postal code"
                  className="h-9 text-sm border-gray-200 bg-white rounded-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPostalCode();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddPostalCode}
                  className="h-9 px-4 text-xs rounded-none"
                >
                  Add
                </Button>
              </div>
              {formData.postalCodes && formData.postalCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.postalCodes.map((code) => (
                    <Badge
                      key={code}
                      variant="secondary"
                      className="pl-2 pr-1 py-1 text-xs bg-white border border-gray-200 rounded-none"
                    >
                      <span className="mr-1">{code}</span>
                      <button
                        type="button"
                        className="hover:bg-gray-200 p-0.5 rounded-none transition-colors"
                        onClick={() => handleRemovePostalCode(code)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-xs font-medium text-gray-700"
              >
                Priority
              </Label>
              <Input
                id="priority"
                type="number"
                min="0"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: parseInt(e.target.value) || 0,
                  })
                }
                className="h-9 text-sm border-gray-200 rounded-none"
              />
              <p className="text-xs text-gray-500">
                Higher priority rates are applied first
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
                <Label
                  htmlFor="isDefault"
                  className="text-xs font-medium text-gray-900 cursor-pointer"
                >
                  Default Tax Rate
                </Label>
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isDefault: checked })
                  }
                />
              </div>

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
            </div>
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
                  {editingTaxRate ? "Updating..." : "Adding..."}
                </>
              ) : editingTaxRate ? (
                "Update Tax Rate"
              ) : (
                "Add Tax Rate"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
