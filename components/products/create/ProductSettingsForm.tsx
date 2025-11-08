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
import { Settings, Star, Sparkles, Ruler, Weight, Shield } from "lucide-react";
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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <div className="p-2 rounded-lg bg-slate-50">
            <Settings className="h-4 w-4 text-slate-600" />
          </div>
          Advanced Settings
        </CardTitle>
        <p className="text-sm text-gray-500">
          Configure additional options and metadata
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Display Options */}
        <div className="space-y-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200/50">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-600" />
            Display Options
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-amber-100">
                  <Star className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div>
                  <Label
                    htmlFor="featured"
                    className="font-medium text-gray-900 cursor-pointer text-sm"
                  >
                    Featured Product
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Highlight in featured sections
                  </p>
                </div>
              </div>
              <Switch
                id="featured"
                checked={!!formData.featured}
                onCheckedChange={(checked) =>
                  handleInputChange("featured", checked)
                }
                className="data-[state=checked]:bg-amber-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-amber-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-amber-100">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div>
                  <Label
                    htmlFor="isNewProduct"
                    className="font-medium text-gray-900 cursor-pointer text-sm"
                  >
                    New Arrival
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Show &quot;New&quot; badge on product
                  </p>
                </div>
              </div>
              <Switch
                id="isNewProduct"
                checked={!!formData.isNewProduct}
                onCheckedChange={(checked) =>
                  handleInputChange("isNewProduct", checked)
                }
                className="data-[state=checked]:bg-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-600" />
            Shipping Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-blue-100">
                  <Ruler className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <Label
                    htmlFor="showDimensions"
                    className="font-medium text-gray-900 cursor-pointer text-sm"
                  >
                    Product Dimensions
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Length, width, and height
                  </p>
                </div>
              </div>
              <Switch
                id="showDimensions"
                checked={showDimensions}
                onCheckedChange={setShowDimensions}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            {showDimensions && (
              <div className="space-y-3 animate-in fade-in-50 duration-300 p-4 bg-white rounded-md border border-blue-100">
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
                    placeholder="Length"
                    className="h-9 text-sm border-blue-200 focus:border-blue-500"
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
                    placeholder="Width"
                    className="h-9 text-sm border-blue-200 focus:border-blue-500"
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
                    placeholder="Height"
                    className="h-9 text-sm border-blue-200 focus:border-blue-500"
                  />
                </div>
                <Select
                  value={dimensions.unit}
                  onValueChange={(unit: ProductDimensions["unit"]) =>
                    setDimensions((d) => ({ ...d, unit }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm border-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSION_UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-blue-100">
                  <Weight className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <Label
                    htmlFor="showWeight"
                    className="font-medium text-gray-900 cursor-pointer text-sm"
                  >
                    Product Weight
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    For shipping calculations
                  </p>
                </div>
              </div>
              <Switch
                id="showWeight"
                checked={showWeight}
                onCheckedChange={setShowWeight}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            {showWeight && (
              <div className="space-y-3 animate-in fade-in-50 duration-300 p-4 bg-white rounded-md border border-blue-100">
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
                    placeholder="Weight value"
                    className="h-9 text-sm border-blue-200 focus:border-blue-500"
                  />
                  <Select
                    value={weight.unit}
                    onValueChange={(unit: (typeof WEIGHT_UNITS)[number]) =>
                      setWeight((w) => ({ ...w, unit }))
                    }
                  >
                    <SelectTrigger className="h-9 text-sm border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WEIGHT_UNITS.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warranty */}
        <div className="space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded bg-green-100">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <Label
              htmlFor="warranty"
              className="text-sm font-semibold text-gray-900"
            >
              Warranty Information
            </Label>
          </div>
          <Input
            id="warranty"
            value={formData.warranty || ""}
            onChange={(e) => handleInputChange("warranty", e.target.value)}
            placeholder="e.g., 1-Year Limited Warranty, 90-Day Money Back"
            className="h-10 bg-white border-green-200 focus:border-green-500 focus:ring-green-500/20"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide warranty details to build customer confidence
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
