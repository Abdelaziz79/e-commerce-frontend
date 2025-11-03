// components/products/add/ImageForm.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductData } from "@/types/product";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

interface ImageFormProps {
  formData: CreateProductData;
  handleInputChange: (
    field: keyof CreateProductData,
    value: File[] | string[] | string | File
  ) => void;
}

export function ImageForm({ formData, handleInputChange }: ImageFormProps) {
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to set the correct tab based on existing images
  useEffect(() => {
    if (formData.images && formData.images.length > 0) {
      const firstImage = formData.images[0];
      if (typeof firstImage === "string" && firstImage.startsWith("http")) {
        setImageType("url");
      } else if (firstImage instanceof File) {
        setImageType("upload");
      }
    }
    // Clear previews when modal/form resets
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    // Validate each file
    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    if (validFiles.length === 0) return;

    // Check if we're mixing types
    const currentImages = formData.images || [];
    if (
      currentImages.length > 0 &&
      typeof currentImages[0] === "string" &&
      !currentImages[0].startsWith("/uploads/")
    ) {
      alert(
        "Please use either file uploads OR URL inputs, not both. Clear existing images first."
      );
      return;
    }

    // Append to existing files or start fresh
    if (currentImages.length > 0 && currentImages[0] instanceof File) {
      const currentFiles = currentImages as File[];
      handleInputChange("images", [...currentFiles, ...validFiles]);
      setPreviewUrls([...previewUrls, ...newPreviews]);
    } else {
      handleInputChange("images", validFiles);
      setPreviewUrls(newPreviews);
    }

    // Set first file as main image if not set
    if (!formData.mainImage && validFiles.length > 0) {
      handleInputChange("mainImage", validFiles[0]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setImageType("upload");
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;

    const currentImages = formData.images || [];

    // Check if we're mixing types
    if (currentImages.length > 0 && currentImages[0] instanceof File) {
      alert(
        "Please use either file uploads OR URL inputs, not both. Clear existing images first."
      );
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    const imageUrls = currentImages as string[];

    if (imageUrls.includes(imageUrl.trim())) {
      alert("This URL has already been added");
      return;
    }

    const newImages: string[] = [...imageUrls, imageUrl.trim()];
    handleInputChange("images", newImages);

    if (!formData.mainImage) {
      handleInputChange("mainImage", newImages[0]);
    }

    setImageUrl("");
    setImageType("url");
  };

  const handleRemoveImageAtIndex = (index: number) => {
    const currentImages = formData.images || [];
    const imageToRemove = currentImages[index];
    const newImages = currentImages.filter((_, i) => i !== index);

    // Separate files and strings
    if (newImages.every((img) => img instanceof File)) {
      handleInputChange("images", newImages as File[]);
    } else if (newImages.every((img) => typeof img === "string")) {
      handleInputChange("images", newImages as string[]);
    } else {
      console.error("Mixed types in images array");
      return;
    }

    // Clean up preview URL if it's a File
    if (imageToRemove instanceof File) {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    }

    // Update main image if removed
    if (imageToRemove === formData.mainImage) {
      handleInputChange("mainImage", newImages[0] || "");
    }
  };

  const handleClearAll = () => {
    // Clean up all preview URLs
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    handleInputChange("images", []);
    handleInputChange("mainImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImagePreview = (image: string | File, index: number): string => {
    if (image instanceof File) {
      return previewUrls[index] || "";
    }
    if (typeof image === "string") {
      if (image.startsWith("/uploads/")) {
        return `${API_BASE_URL}${image}`;
      }
      return image;
    }
    return "";
  };

  const getImageDisplayName = (image: string | File): string => {
    if (typeof image === "string") {
      return image.split("/").pop() || image;
    }
    return image.name;
  };

  const getImageValue = (image: string | File): string => {
    if (typeof image === "string") {
      return image;
    }
    return image.name;
  };

  const isMainImage = (image: string | File): boolean => {
    if (!formData.mainImage) return false;
    if (typeof image === "string" && typeof formData.mainImage === "string") {
      return image === formData.mainImage;
    }
    if (image instanceof File && formData.mainImage instanceof File) {
      return (
        image.name === formData.mainImage.name &&
        image.size === formData.mainImage.size
      );
    }
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Product Images
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Add Images</Label>

          <Tabs
            value={imageType}
            onValueChange={(v) => setImageType(v as "upload" | "url")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
              <TabsTrigger value="url">Use URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-files"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-10"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                {formData.images && formData.images.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearAll}
                    className="h-10"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPEG, PNG, WebP (Max 5MB per file)
              </p>
            </TabsContent>

            <TabsContent value="url" className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-10"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="h-10"
                >
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a valid image URL and click Add
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base font-medium">
              Added Images ({formData.images.length})
            </Label>

            {/* Image Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => {
                const preview = getImagePreview(image, index);
                return (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                      isMainImage(image)
                        ? "border-primary shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Main Image Badge */}
                    {isMainImage(image) && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          Main
                        </Badge>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImageAtIndex(index)}
                      className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    {/* Image Preview */}
                    <div className="relative aspect-square bg-gray-100">
                      {preview ? (
                        <Image
                          src={preview}
                          alt={getImageDisplayName(image)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Image Name */}
                    <div className="p-2 bg-gray-50 border-t">
                      <p className="text-xs text-gray-600 truncate">
                        {getImageDisplayName(image)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Image Selector */}
            {formData.images.length > 1 && (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="mainImage" className="text-sm font-medium">
                  Select Main Image
                </Label>
                <Select
                  value={
                    formData.mainImage
                      ? getImageValue(formData.mainImage as string | File)
                      : undefined
                  }
                  onValueChange={(value) => {
                    const selectedImage = formData.images?.find(
                      (img) => getImageValue(img) === value
                    );
                    if (selectedImage) {
                      handleInputChange("mainImage", selectedImage);
                    }
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select main image" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.images.map((image, index) => (
                      <SelectItem key={index} value={getImageValue(image)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Image {index + 1}: </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {getImageDisplayName(image)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The main image will be displayed as the primary product image
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
