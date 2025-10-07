// app/admin/products/add/components/CategoryTagForm.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateProductData } from "@/types/product";
import { Plus, Tag, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface CategoryTagFormProps {
  formData: CreateProductData;
  currentTag: string;
  setCurrentTag: Dispatch<SetStateAction<string>>;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

export function CategoryTagForm({
  formData,
  currentTag,
  setCurrentTag,
  handleAddTag,
  handleRemoveTag,
}: CategoryTagFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <Label>Product Tags</Label>
          <div className="flex gap-4">
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add tag"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button type="button" onClick={handleAddTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
