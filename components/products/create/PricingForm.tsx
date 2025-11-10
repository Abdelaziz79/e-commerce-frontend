// app/admin/products/create/components/PricingForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreateProductData } from "@/types/product";
import { DollarSign, TrendingDown } from "lucide-react";

interface PricingFormProps {
  formData: CreateProductData;
  handleInputChange: (
    field: keyof CreateProductData,
    value: string | number | boolean
  ) => void;
}

export function PricingForm({ formData, handleInputChange }: PricingFormProps) {
  const discount =
    formData.onSale && formData.salePrice
      ? Math.round(
          ((formData.price - formData.salePrice) / formData.price) * 100
        )
      : 0;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <DollarSign className="h-4 w-4 text-gray-500" />
          Pricing & Stock
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Base Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs font-medium text-gray-700">
            Base Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              $
            </span>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) =>
                handleInputChange("price", parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
              className="pl-7 h-9 text-sm border-gray-200 rounded-none"
            />
          </div>
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <Label
            htmlFor="countInStock"
            className="text-xs font-medium text-gray-700"
          >
            Stock Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="countInStock"
            type="number"
            min="0"
            required
            value={formData.countInStock}
            onChange={(e) =>
              handleInputChange("countInStock", parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="h-9 text-sm border-gray-200 rounded-none"
          />
        </div>

        {/* Sale Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-gray-500" />
            <div>
              <Label
                htmlFor="onSale"
                className="text-xs font-medium text-gray-900 cursor-pointer"
              >
                Sale Pricing
              </Label>
              <p className="text-xs text-gray-500">Offer a discounted price</p>
            </div>
          </div>
          <Switch
            id="onSale"
            checked={!!formData.onSale}
            onCheckedChange={(checked) => handleInputChange("onSale", checked)}
          />
        </div>

        {/* Sale Details */}
        {formData.onSale && (
          <div className="space-y-4 p-4 bg-gray-50 border border-gray-200">
            <div className="space-y-2">
              <Label
                htmlFor="salePrice"
                className="text-xs font-medium text-gray-700"
              >
                Sale Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required={formData.onSale}
                  value={formData.salePrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "salePrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  className="pl-7 h-9 text-sm border-gray-200 bg-white rounded-none"
                />
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-gray-900">
                    {discount}% OFF
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Save $
                    {(formData.price - (formData.salePrice || 0)).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="saleEndDate"
                className="text-xs font-medium text-gray-700"
              >
                Sale End Date{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Input
                id="saleEndDate"
                type="datetime-local"
                value={formData.saleEndDate || ""}
                onChange={(e) =>
                  handleInputChange("saleEndDate", e.target.value)
                }
                className="h-9 text-sm border-gray-200 bg-white rounded-none"
              />
              <p className="text-xs text-gray-500">
                Leave empty for ongoing sale
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
