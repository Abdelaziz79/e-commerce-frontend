// app/admin/products/add/components/ProductSettingsForm.tsx
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="featured"
              checked={!!formData.featured}
              onCheckedChange={(checked) =>
                handleInputChange("featured", checked)
              }
            />
            <Label htmlFor="featured">Featured product</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="isNewProduct"
              checked={!!formData.isNewProduct}
              onCheckedChange={(checked) =>
                handleInputChange("isNewProduct", checked)
              }
            />
            <Label htmlFor="isNewProduct">Mark as new product</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="showDimensions"
              checked={showDimensions}
              onCheckedChange={setShowDimensions}
            />
            <Label htmlFor="showDimensions">Add shipping dimensions</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="showWeight"
              checked={showWeight}
              onCheckedChange={setShowWeight}
            />
            <Label htmlFor="showWeight">Add shipping weight</Label>
          </div>
        </div>

        {showDimensions && (
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-medium">Dimensions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  min="0"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      length: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  min="0"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      width: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  min="0"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions((d) => ({
                      ...d,
                      height: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensionUnit">Unit</Label>
                <Select
                  value={dimensions.unit}
                  onValueChange={(unit: ProductDimensions["unit"]) =>
                    setDimensions((d) => ({ ...d, unit }))
                  }
                >
                  <SelectTrigger>
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
            </div>
          </div>
        )}

        {showWeight && (
          <div className="space-y-4 border-t pt-6">
            <Label className="text-base font-medium">Weight</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  value={weight.value}
                  onChange={(e) =>
                    setWeight((w) => ({
                      ...w,
                      value: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Unit</Label>
                <Select
                  value={weight.unit}
                  onValueChange={(unit: (typeof WEIGHT_UNITS)[number]) =>
                    setWeight((w) => ({ ...w, unit }))
                  }
                >
                  <SelectTrigger>
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
          </div>
        )}

        <div className="space-y-2 border-t pt-6">
          <Label htmlFor="warranty">Warranty Information</Label>
          <Input
            id="warranty"
            value={formData.warranty || ""}
            onChange={(e) => handleInputChange("warranty", e.target.value)}
            placeholder="e.g., 1 year manufacturer warranty"
          />
        </div>
      </CardContent>
    </Card>
  );
}
