// components/products/add/PricingInventoryForm.tsx
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
import { Switch } from "@/components/ui/switch";
import { Category } from "@/types/category";
import { CreateProductData } from "@/types/product";
import { DollarSign, Plus } from "lucide-react";

interface PricingInventoryFormProps {
  formData: CreateProductData;
  handleInputChange: (
    field: keyof CreateProductData,
    value: string | number | boolean
  ) => void;
  categories: Category[];
  onAddNewCategory: () => void;
}

export function PricingInventoryForm({
  formData,
  handleInputChange,
  categories,
  onAddNewCategory,
}: PricingInventoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Pricing & Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countInStock">Stock Count *</Label>
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
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              required
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
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
              onClick={onAddNewCategory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4 border-t">
          <Switch
            id="onSale"
            checked={!!formData.onSale}
            onCheckedChange={(checked) => handleInputChange("onSale", checked)}
          />
          <Label htmlFor="onSale">Product is on sale</Label>
        </div>

        {formData.onSale && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                required={formData.onSale}
                value={formData.salePrice || 0}
                onChange={(e) =>
                  handleInputChange(
                    "salePrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleEndDate">Sale End Date</Label>
              <Input
                id="saleEndDate"
                type="datetime-local"
                value={formData.saleEndDate || ""}
                onChange={(e) =>
                  handleInputChange("saleEndDate", e.target.value)
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
