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
import { FolderKanban, Plus, X, Tag, Sparkles } from "lucide-react";
import { useState } from "react";
import { SearchableSelect } from "./SearchableSelect";

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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
            <div className="p-2 rounded-lg bg-emerald-50">
              <FolderKanban className="h-4 w-4 text-emerald-600" />
            </div>
            Organization
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3 w-3" />
            Required
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Categorize and tag your product for better discoverability
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Category */}
        <div className="space-y-2">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Category
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchableSelect
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                useSearchableInfiniteQuery={
                  useSearchableInfiniteAdminCategories
                }
                placeholder="Search or select a category"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 flex-shrink-0 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300"
              onClick={onAddNewCategory}
              title="Add new category"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Choose the most relevant category for your product
          </p>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label
            htmlFor="brand"
            className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
          >
            Brand
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchableSelect
                value={formData.brand}
                onValueChange={(value) => handleInputChange("brand", value)}
                useSearchableInfiniteQuery={useSearchableInfiniteAdminBrands}
                placeholder="Search or select a brand"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 flex-shrink-0 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300"
              onClick={onAddNewBrand}
              title="Add new brand"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Select the manufacturer or brand name
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Product Tags
              <span className="text-gray-400 text-xs ml-1.5">(Optional)</span>
            </Label>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add keywords (e.g., Summer, Eco-friendly)"
                className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={!currentTag.trim()}
              className="h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Add tags to improve search and filtering. Press Enter or click Add.
          </p>

          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="pl-3 pr-1.5 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <span className="mr-1.5">{tag}</span>
                  <button
                    type="button"
                    className="rounded-full hover:bg-blue-200 p-0.5 transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3.5 w-3.5" />
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
