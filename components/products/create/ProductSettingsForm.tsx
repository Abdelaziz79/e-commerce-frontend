// app/admin/products/create/components/ProductSettingsForm.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CreateProductData, ProductDimensions } from "@/types/product";
import { Settings } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const WEIGHT_UNITS = ["kg", "g", "lb", "oz"] as const;
const DIMENSION_UNITS = ["cm", "inch", "mm", "m"] as const;

interface ProductSettingsFormProps {
  formData: CreateProductData;
  handleInputChange: (
    field: keyof CreateProductData,
    value: string | boolean
  ) => void;
  showDimensions: boolean;
  setShowDimensions: Dispatch<SetStateAction<boolean>>;
  showWeight: boolean;
  setShowWeight: Dispatch<SetStateAction<boolean>>;
  dimensions: ProductDimensions;
  setDimensions: Dispatch<SetStateAction<ProductDimensions>>;
  weight: { value: number; unit: (typeof WEIGHT_UNITS)[number] };
  setWeight: Dispatch<
    SetStateAction<{ value: number; unit: (typeof WEIGHT_UNITS)[number] }>
  >;
}

export function ProductSettingsForm({
  formData,
  handleInputChange,
  showDimensions,
  setShowDimensions,
  showWeight,
  setShowWeight,
  dimensions,
  setDimensions,
  weight,
  setWeight,
}: ProductSettingsFormProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Settings className="h-4 w-4 text-gray-500" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Display Options */}
        <div className="space-y-3 pb-5 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-900">
            Display Options
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <Label
              htmlFor="featured"
              className="text-xs font-medium text-gray-900 cursor-pointer"
            >
              Featured Product
            </Label>
            <Switch
              id="featured"
              checked={!!formData.featured}
              onCheckedChange={(checked) =>
                handleInputChange("featured", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <Label
              htmlFor="isNewProduct"
              className="text-xs font-medium text-gray-900 cursor-pointer"
            >
              New Arrival
            </Label>
            <Switch
              id="isNewProduct"
              checked={!!formData.isNewProduct}
              onCheckedChange={(checked) =>
                handleInputChange("isNewProduct", checked)
              }
            />
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-3 pb-5 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-900">
            Shipping Information
          </h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <Label
              htmlFor="showDimensions"
              className="text-xs font-medium text-gray-900 cursor-pointer"
            >
              Add Dimensions
            </Label>
            <Switch
              id="showDimensions"
              checked={showDimensions}
              onCheckedChange={setShowDimensions}
            />
          </div>

          {showDimensions && (
            <div className="space-y-3 p-4 bg-white border border-gray-200">
              <Label className="text-xs font-medium text-gray-700">
                Dimensions
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      length: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="L"
                  className="h-9 text-sm border-gray-200 rounded-none"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      width: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="W"
                  className="h-9 text-sm border-gray-200 rounded-none"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      height: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="H"
                  className="h-9 text-sm border-gray-200 rounded-none"
                />
              </div>
              <Select
                value={dimensions.unit}
                onValueChange={(unit: ProductDimensions["unit"]) =>
                  setDimensions((d) => ({ ...d, unit }))
                }
              >
                <SelectTrigger className="h-9 text-sm border-gray-200 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSION_UNITS.map((u) => (
                    <SelectItem key={u} value={u} className="text-xs">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200">
            <Label
              htmlFor="showWeight"
              className="text-xs font-medium text-gray-900 cursor-pointer"
            >
              Add Weight
            </Label>
            <Switch
              id="showWeight"
              checked={showWeight}
              onCheckedChange={setShowWeight}
            />
          </div>

          {showWeight && (
            <div className="space-y-3 p-4 bg-white border border-gray-200">
              <Label className="text-xs font-medium text-gray-700">
                Weight
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={weight.value}
                  onChange={(e) =>
                    setWeight((w) => ({
                      ...w,
                      value: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Value"
                  className="h-9 text-sm border-gray-200 rounded-none"
                />
                <Select
                  value={weight.unit}
                  onValueChange={(unit: (typeof WEIGHT_UNITS)[number]) =>
                    setWeight((w) => ({ ...w, unit }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm border-gray-200 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEIGHT_UNITS.map((u) => (
                      <SelectItem key={u} value={u} className="text-xs">
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Warranty */}
        <div className="space-y-2">
          <Label
            htmlFor="warranty"
            className="text-xs font-medium text-gray-700"
          >
            Warranty Information
          </Label>
          <Input
            id="warranty"
            value={formData.warranty || ""}
            onChange={(e) => handleInputChange("warranty", e.target.value)}
            placeholder="e.g., 1-Year Limited Warranty"
            className="h-9 text-sm border-gray-200 rounded-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
