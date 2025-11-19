// app/admin/products/create/components/OrganizationForm.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchableInfiniteAdminBrands } from "@/hooks/use-brand-hooks";
import { useSearchableInfiniteAdminCategories } from "@/hooks/use-category-hooks";
import { CreateProductData } from "@/types/product";
import { FolderKanban, Plus, X } from "lucide-react";
import { useState } from "react";
import { SearchableSelect } from "../../shared/SearchableSelect";

interface OrganizationFormProps {
  formData: CreateProductData;
  handleInputChange: (
    field: keyof CreateProductData,
    value: string | string[]
  ) => void;
  onAddNewCategory: () => void;
  onAddNewBrand: () => void;
}

export function OrganizationForm({
  formData,
  handleInputChange,
  onAddNewCategory,
  onAddNewBrand,
}: OrganizationFormProps) {
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
      handleInputChange("tags", [...(formData.tags || []), trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove) || []
    );
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <FolderKanban className="h-4 w-4 text-gray-500" />
          Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Category */}
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-xs font-medium text-gray-700"
          >
            Category <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchableSelect
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                useSearchableInfiniteQuery={
                  useSearchableInfiniteAdminCategories
                }
                placeholder="Select category"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 flex-shrink-0 border-gray-200 rounded-none"
              onClick={onAddNewCategory}
              title="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">Choose the product category</p>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-xs font-medium text-gray-700">
            Brand <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchableSelect
                value={formData.brand}
                onValueChange={(value) => handleInputChange("brand", value)}
                useSearchableInfiniteQuery={useSearchableInfiniteAdminBrands}
                placeholder="Select brand"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 flex-shrink-0 border-gray-200 rounded-none"
              onClick={onAddNewBrand}
              title="Add new brand"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Select the manufacturer or brand
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <Label htmlFor="tags" className="text-xs font-medium text-gray-700">
            Tags <span className="text-gray-400 text-xs">(Optional)</span>
          </Label>

          <div className="flex gap-2">
            <Input
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add keywords"
              className="h-9 text-sm border-gray-200 rounded-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
              className="h-9 px-4 text-xs rounded-none"
            >
              Add
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Add tags for better search and filtering
          </p>

          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-none"
                >
                  <span className="mr-1">{tag}</span>
                  <button
                    type="button"
                    className="hover:bg-gray-200 p-0.5 rounded-none transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
