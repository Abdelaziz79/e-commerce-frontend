// app/admin/products/create/components/VariationsForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData, ProductVariation } from "@/types/product";
import { Layers, Trash2, Plus, Package, DollarSign } from "lucide-react";
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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <div className="p-2 rounded-lg bg-indigo-50">
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          Product Variations
        </CardTitle>
        <p className="text-sm text-gray-500">
          Add multiple versions with different attributes like size, color, or
          material
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Variation Form */}
        <div className="p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Add New Variation
            </h3>
            <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border">
              {formData.variations?.length || 0} added
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SKU */}
            <div className="space-y-2">
              <Label
                htmlFor="varSku"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                SKU
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="varSku"
                value={currentVariation.sku}
                onChange={(e) => handleVarChange("sku", e.target.value)}
                placeholder="VARIANT-SKU-001"
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Price Override */}
            <div className="space-y-2">
              <Label
                htmlFor="varPrice"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <DollarSign className="h-3.5 w-3.5" />
                Price Override
                <span className="text-gray-400 text-xs">(Optional)</span>
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
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label
                htmlFor="varStock"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Package className="h-3.5 w-3.5" />
                Stock
                <span className="text-red-500">*</span>
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
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label
                htmlFor="varSize"
                className="text-sm font-medium text-gray-700"
              >
                Size
              </Label>
              <Input
                id="varSize"
                value={currentVariation.size || ""}
                onChange={(e) => handleVarChange("size", e.target.value)}
                placeholder="e.g., XL, 42"
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label
                htmlFor="varColor"
                className="text-sm font-medium text-gray-700"
              >
                Color
              </Label>
              <Input
                id="varColor"
                value={currentVariation.color || ""}
                onChange={(e) => handleVarChange("color", e.target.value)}
                placeholder="e.g., Navy Blue"
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Material */}
            <div className="space-y-2">
              <Label
                htmlFor="varMaterial"
                className="text-sm font-medium text-gray-700"
              >
                Material
              </Label>
              <Input
                id="varMaterial"
                value={currentVariation.material || ""}
                onChange={(e) => handleVarChange("material", e.target.value)}
                placeholder="e.g., Cotton Blend"
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>

            {/* Style */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <Label
                htmlFor="varStyle"
                className="text-sm font-medium text-gray-700"
              >
                Style
              </Label>
              <Input
                id="varStyle"
                value={currentVariation.style || ""}
                onChange={(e) => handleVarChange("style", e.target.value)}
                placeholder="e.g., V-Neck, Slim Fit"
                className="h-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleAddVariation}
              disabled={!currentVariation.sku}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Variation
            </Button>
          </div>
        </div>

        {/* Variations List */}
        {formData.variations && formData.variations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Active Variations ({formData.variations.length})
              </h3>
            </div>
            <div className="space-y-2">
              {formData.variations.map((variation, index) => (
                <div
                  key={index}
                  className="group p-4 border border-gray-200 bg-white rounded-lg hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* SKU Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-semibold text-gray-900 text-sm">
                          {variation.sku}
                        </span>
                        {variation.price &&
                          variation.price !== formData.price && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                              Custom Price
                            </span>
                          )}
                      </div>

                      {/* Attributes Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { label: "Size", value: variation.size, icon: "📏" },
                          {
                            label: "Color",
                            value: variation.color,
                            icon: "🎨",
                          },
                          {
                            label: "Material",
                            value: variation.material,
                            icon: "🧵",
                          },
                          {
                            label: "Style",
                            value: variation.style,
                            icon: "✨",
                          },
                        ]
                          .filter((v) => v.value)
                          .map((v) => (
                            <div
                              key={v.label}
                              className="flex items-center gap-1.5"
                            >
                              <span className="text-gray-400">{v.icon}</span>
                              <span className="text-gray-600">{v.label}:</span>
                              <span className="font-medium text-gray-900 truncate">
                                {v.value}
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Price & Stock Info */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs">
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-600">Price:</span>
                          <span className="font-semibold text-gray-900">
                            ${(variation.price || formData.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-gray-600">Stock:</span>
                          <span
                            className={`font-semibold ${
                              variation.countInStock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {variation.countInStock} units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
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
