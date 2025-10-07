// components/products/add/BasicInfoForm.tsx
"use client";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Brand } from "@/types/brand";
import { CreateProductData } from "@/types/product";
import { Package, Plus } from "lucide-react";

interface BasicInfoFormProps {
  formData: CreateProductData;
  handleInputChange: (field: keyof CreateProductData, value: string) => void;
  brands: Brand[];
  onAddNewBrand: () => void;
}

export function BasicInfoForm({
  formData,
  handleInputChange,
  brands,
  onAddNewBrand,
}: BasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select
              required
              value={formData.brand}
              onValueChange={(value) => handleInputChange("brand", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 self-end">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onAddNewBrand}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Brand
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Enter product description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="richDescription">Rich Description</Label>
          <Textarea
            id="richDescription"
            value={formData.richDescription || ""}
            onChange={(e) =>
              handleInputChange("richDescription", e.target.value)
            }
            placeholder="Enter detailed product description (optional)"
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}
