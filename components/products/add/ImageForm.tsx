// app/admin/products/add/components/ImageForm.tsx
"use client";

import { Badge } from "@/components/ui/badge";
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
import { CreateProductData } from "@/types/product";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ImageFormProps {
  formData: CreateProductData;
  handleInputChange: (field: keyof CreateProductData, value: string) => void;
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
  handleAddImage: () => void;
  handleRemoveImage: (image: string) => void;
}

export function ImageForm({
  formData,
  handleInputChange,
  imageUrl,
  setImageUrl,
  handleAddImage,
  handleRemoveImage,
}: ImageFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Product Images
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex gap-4">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL and click Add"
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImage();
              }
            }}
          />
          <Button type="button" onClick={handleAddImage}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <Label>Uploaded Images ({formData.images.length})</Label>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((image, index) => (
                <Badge
                  key={index}
                  variant={
                    image === formData.mainImage ? "default" : "secondary"
                  }
                  className="flex items-center gap-2 text-sm p-2"
                >
                  <span className="max-w-[150px] truncate">
                    {image.split("/").pop()}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0"
                    onClick={() => handleRemoveImage(image)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            {formData.images.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="mainImage">Main Image</Label>
                <Select
                  value={formData.mainImage}
                  onValueChange={(value) =>
                    handleInputChange("mainImage", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main image" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.images.map((image, index) => (
                      <SelectItem key={index} value={image}>
                        {image.split("/").pop()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
