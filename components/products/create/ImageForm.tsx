// components/products/create/ImageForm.tsx
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
import { getImageSrc } from "@/lib/utils"; // Assuming your utils file is in lib
import { CreateProductData } from "@/types/product";
import { Image as ImageIcon, Link as LinkIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (formData.images && formData.images.length > 0) {
      const firstImage = formData.images[0];
      if (typeof firstImage === "string" && firstImage.startsWith("http")) {
        setImageType("url");
      } else if (firstImage instanceof File) {
        setImageType("upload");
      }
    }
    // Cleanup object URLs on unmount
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

    if (currentImages.length > 0 && currentImages[0] instanceof File) {
      const currentFiles = currentImages as File[];
      handleInputChange("images", [...currentFiles, ...validFiles]);
      setPreviewUrls([...previewUrls, ...newPreviews]);
    } else {
      handleInputChange("images", validFiles);
      setPreviewUrls(newPreviews);
    }

    if (!formData.mainImage && validFiles.length > 0) {
      handleInputChange("mainImage", validFiles[0]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setImageType("upload");
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;

    const currentImages = formData.images || [];

    if (currentImages.length > 0 && currentImages[0] instanceof File) {
      alert(
        "Please use either file uploads OR URL inputs, not both. Clear existing images first."
      );
      return;
    }

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

    if (newImages.every((img) => img instanceof File)) {
      handleInputChange("images", newImages as File[]);
    } else if (newImages.every((img) => typeof img === "string")) {
      handleInputChange("images", newImages as string[]);
    } else {
      // Handle empty array case
      handleInputChange("images", []);
    }

    if (imageToRemove instanceof File) {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    }

    if (imageToRemove === formData.mainImage) {
      handleInputChange("mainImage", newImages[0] || "");
    }
  };

  const handleClearAll = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    handleInputChange("images", []);
    handleInputChange("mainImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImagePreview = (image: string | File, index: number): string => {
    // For new file uploads, use the local object URL for preview
    if (image instanceof File) {
      return previewUrls[index] || "";
    }
    // For existing images (either a remote URL or a local path), use the utility
    if (typeof image === "string") {
      return getImageSrc(image);
    }
    // Return a placeholder if the image is not a recognized type
    return getImageSrc();
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
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ImageIcon className="h-4 w-4 text-gray-500" />
          Product Images
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <Tabs
          value={imageType}
          onValueChange={(v) => setImageType(v as "upload" | "url")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-9 bg-gray-100 rounded-none">
            <TabsTrigger
              value="upload"
              className="text-xs data-[state=active]:bg-white rounded-none"
            >
              <Upload className="h-3 w-3 mr-1.5" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="text-xs data-[state=active]:bg-white rounded-none"
            >
              <LinkIcon className="h-3 w-3 mr-1.5" />
              Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-3 mt-4">
            <div className="border-2 border-dashed border-gray-200 rounded-none p-8 text-center bg-gray-50">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="image-files"
              />
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium h-9 rounded-none"
                  >
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    or drag and drop here
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  JPEG, PNG, WebP • Max 5MB each
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-3 mt-4">
            <div className="flex gap-2">
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="h-9 text-sm border-gray-200 rounded-none"
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
                className="h-9 px-4 text-xs rounded-none"
              >
                Add URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {formData.images && formData.images.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-700">
                {formData.images.length}{" "}
                {formData.images.length === 1 ? "Image" : "Images"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.images.map((image, index) => {
                const preview = getImagePreview(image, index);
                const isMain = isMainImage(image);
                return (
                  <div
                    key={index}
                    className={`group relative rounded-none overflow-hidden border-2 transition-all ${
                      isMain ? "border-gray-900" : "border-gray-200"
                    }`}
                  >
                    {isMain && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-gray-900 text-white text-xs rounded-none">
                          Main
                        </Badge>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImageAtIndex(index)}
                      className="absolute top-2 right-2 z-10 bg-white hover:bg-red-500 text-gray-700 hover:text-white rounded-none p-1 opacity-0 group-hover:opacity-100 transition-all border border-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    <div className="relative aspect-square bg-white">
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
                          <ImageIcon className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 truncate">
                        {getImageDisplayName(image)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.images.length > 1 && (
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <Label
                  htmlFor="mainImage"
                  className="text-xs font-medium text-gray-700"
                >
                  Primary Display Image
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
                  <SelectTrigger className="h-9 text-sm border-gray-200 rounded-none">
                    <SelectValue placeholder="Select main image" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.images.map((image, index) => (
                      <SelectItem
                        key={index}
                        value={getImageValue(image)}
                        className="text-xs"
                      >
                        Image {index + 1}: {getImageDisplayName(image)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
