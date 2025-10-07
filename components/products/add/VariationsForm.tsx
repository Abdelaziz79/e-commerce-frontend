// app/admin/products/add/components/VariationsForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData, ProductVariation } from "@/types/product";
import { Layers, Minus, Plus } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Product Variations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="varSku">SKU *</Label>
            <Input
              id="varSku"
              value={currentVariation.sku}
              onChange={(e) => handleVarChange("sku", e.target.value)}
              placeholder="VARIANT-SKU"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varPrice">Price (optional)</Label>
            <Input
              id="varPrice"
              type="number"
              min="0"
              value={currentVariation.price}
              onChange={(e) =>
                handleVarChange("price", parseFloat(e.target.value) || 0)
              }
              placeholder="Overrides main price"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varStock">Stock *</Label>
            <Input
              id="varStock"
              type="number"
              min="0"
              value={currentVariation.countInStock}
              onChange={(e) =>
                handleVarChange("countInStock", parseInt(e.target.value) || 0)
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varSize">Size</Label>
            <Input
              id="varSize"
              value={currentVariation.size || ""}
              onChange={(e) => handleVarChange("size", e.target.value)}
              placeholder="e.g., XL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varColor">Color</Label>
            <Input
              id="varColor"
              value={currentVariation.color || ""}
              onChange={(e) => handleVarChange("color", e.target.value)}
              placeholder="e.g., Red"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="varMaterial">Material</Label>
            <Input
              id="varMaterial"
              value={currentVariation.material || ""}
              onChange={(e) => handleVarChange("material", e.target.value)}
              placeholder="e.g., Cotton"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleAddVariation}
            variant="outline"
            disabled={!currentVariation.sku}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variation
          </Button>
        </div>

        {formData.variations && formData.variations.length > 0 && (
          <div className="space-y-4 border-t pt-6">
            <Label>Added Variations ({formData.variations.length})</Label>
            <div className="space-y-3">
              {formData.variations.map((variation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-semibold text-gray-800">
                        {variation.sku}
                      </span>
                      <span className="text-gray-600">
                        Price: ${variation.price || formData.price}
                      </span>
                      <span className="text-gray-600">
                        Stock: {variation.countInStock}
                      </span>
                      {variation.size && (
                        <span className="text-gray-600">
                          Size: {variation.size}
                        </span>
                      )}
                      {variation.color && (
                        <span className="text-gray-600">
                          Color: {variation.color}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveVariation(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
