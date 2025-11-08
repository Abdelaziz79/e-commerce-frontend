// app/admin/products/create/components/PricingForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreateProductData } from "@/types/product";
import {
  DollarSign,
  Package,
  TrendingDown,
  Calendar,
  Sparkles,
} from "lucide-react";

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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
            <div className="p-2 rounded-lg bg-green-50">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            Pricing & Stock
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Required
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Base Price */}
        <div className="space-y-2">
          <Label
            htmlFor="price"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Base Price
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20 font-medium text-lg"
            />
          </div>
          <p className="text-xs text-gray-500">
            Set the regular selling price for this product
          </p>
        </div>

        {/* Stock Quantity */}
        <div className="space-y-2">
          <Label
            htmlFor="countInStock"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Stock Quantity
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20 font-medium"
            />
          </div>
          <p className="text-xs text-gray-500">
            Total units available for sale
          </p>
        </div>

        {/* Sale Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <Label
                htmlFor="onSale"
                className="font-medium text-gray-900 cursor-pointer"
              >
                Sale Pricing
              </Label>
              <p className="text-xs text-gray-600 mt-0.5">
                Offer a discounted price
              </p>
            </div>
          </div>
          <Switch
            id="onSale"
            checked={!!formData.onSale}
            onCheckedChange={(checked) => handleInputChange("onSale", checked)}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>

        {/* Sale Details */}
        {formData.onSale && (
          <div className="space-y-4 animate-in fade-in-50 duration-300 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
            <div className="space-y-2">
              <Label
                htmlFor="salePrice"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                Sale Price
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <TrendingDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-600" />
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
                  className="pl-10 h-11 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 font-medium text-lg bg-white"
                />
              </div>
              {discount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-orange-600">
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
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" />
                Sale End Date
                <span className="text-gray-400 text-xs ml-1">(Optional)</span>
              </Label>
              <Input
                id="saleEndDate"
                type="datetime-local"
                value={formData.saleEndDate || ""}
                onChange={(e) =>
                  handleInputChange("saleEndDate", e.target.value)
                }
                className="h-11 border-orange-200 focus:border-orange-500 focus:ring-orange-500/20 bg-white"
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
