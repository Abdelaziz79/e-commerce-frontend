// app/admin/products/create/components/VariationsForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData, ProductVariation } from "@/types/product";
import { Layers, Trash2, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface VariationsFormProps {
  formData: CreateProductData;
  currentVariation: ProductVariation;
  setCurrentVariation: Dispatch<SetStateAction<ProductVariation>>;
  handleAddVariation: () => void;
  handleRemoveVariation: (index: number) => void;
}

export function VariationsForm({
  formData,
  currentVariation,
  setCurrentVariation,
  handleAddVariation,
  handleRemoveVariation,
}: VariationsFormProps) {
  const handleVarChange = (
    field: keyof ProductVariation,
    value: string | number
  ) => {
    setCurrentVariation((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Layers className="h-4 w-4 text-gray-500" />
          Product Variations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Add Variation Form */}
        <div className="p-4 border-2 border-dashed border-gray-200 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900">
              Add New Variation
            </h3>
            <span className="text-xs text-gray-500">
              {formData.variations?.length || 0} added
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="varSku"
                className="text-xs font-medium text-gray-700"
              >
                SKU <span className="text-red-500">*</span>
              </Label>
              <Input
                id="varSku"
                value={currentVariation.sku}
                onChange={(e) => handleVarChange("sku", e.target.value)}
                placeholder="VARIANT-SKU-001"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="varPrice"
                className="text-xs font-medium text-gray-700"
              >
                Price <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Input
                id="varPrice"
                type="number"
                min="0"
                step="0.01"
                value={currentVariation.price}
                onChange={(e) =>
                  handleVarChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder={`Base: $${formData.price}`}
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="varStock"
                className="text-xs font-medium text-gray-700"
              >
                Stock <span className="text-red-500">*</span>
              </Label>
              <Input
                id="varStock"
                type="number"
                min="0"
                value={currentVariation.countInStock}
                onChange={(e) =>
                  handleVarChange("countInStock", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="varSize"
                className="text-xs font-medium text-gray-700"
              >
                Size
              </Label>
              <Input
                id="varSize"
                value={currentVariation.size || ""}
                onChange={(e) => handleVarChange("size", e.target.value)}
                placeholder="e.g., XL"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="varColor"
                className="text-xs font-medium text-gray-700"
              >
                Color
              </Label>
              <Input
                id="varColor"
                value={currentVariation.color || ""}
                onChange={(e) => handleVarChange("color", e.target.value)}
                placeholder="e.g., Navy Blue"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="varMaterial"
                className="text-xs font-medium text-gray-700"
              >
                Material
              </Label>
              <Input
                id="varMaterial"
                value={currentVariation.material || ""}
                onChange={(e) => handleVarChange("material", e.target.value)}
                placeholder="e.g., Cotton"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
              <Label
                htmlFor="varStyle"
                className="text-xs font-medium text-gray-700"
              >
                Style
              </Label>
              <Input
                id="varStyle"
                value={currentVariation.style || ""}
                onChange={(e) => handleVarChange("style", e.target.value)}
                placeholder="e.g., V-Neck"
                className="h-9 text-sm border-gray-200 rounded-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleAddVariation}
              disabled={!currentVariation.sku}
              className="text-xs h-9 rounded-none"
            >
              <Plus className="h-3 w-3 mr-1.5" />
              Add Variation
            </Button>
          </div>
        </div>

        {/* Variations List */}
        {formData.variations && formData.variations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-900">
              Active Variations ({formData.variations.length})
            </h3>
            <div className="space-y-2">
              {formData.variations.map((variation, index) => (
                <div
                  key={index}
                  className="group p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-gray-900 text-xs">
                          {variation.sku}
                        </span>
                        {variation.price &&
                          variation.price !== formData.price && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200">
                              Custom Price
                            </span>
                          )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { label: "Size", value: variation.size },
                          { label: "Color", value: variation.color },
                          { label: "Material", value: variation.material },
                          { label: "Style", value: variation.style },
                        ]
                          .filter((v) => v.value)
                          .map((v) => (
                            <div key={v.label}>
                              <span className="text-gray-500">{v.label}:</span>{" "}
                              <span className="font-medium text-gray-900">
                                {v.value}
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2 border-t border-gray-200 text-xs">
                        <div>
                          <span className="text-gray-500">Price:</span>{" "}
                          <span className="font-semibold text-gray-900">
                            ${(variation.price || formData.price).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>{" "}
                          <span className="font-semibold text-gray-900">
                            {variation.countInStock}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveVariation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
