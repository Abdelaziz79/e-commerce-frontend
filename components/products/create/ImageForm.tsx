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
import { CreateProductData } from "@/types/product";
import {
  Image as ImageIcon,
  Upload,
  X,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (formData.images && formData.images.length > 0) {
      const firstImage = formData.images[0];
      if (typeof firstImage === "string" && firstImage.startsWith("http")) {
        setImageType("url");
      } else if (firstImage instanceof File) {
        setImageType("upload");
      }
    }
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
      console.error("Mixed types in images array");
      return;
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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <div className="p-2 rounded-lg bg-purple-50">
            <ImageIcon className="h-4 w-4 text-purple-600" />
          </div>
          Product Images
        </CardTitle>
        <p className="text-sm text-gray-500">
          Add high-quality images to showcase your product
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Tabs
          value={imageType}
          onValueChange={(v) => setImageType(v as "upload" | "url")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-11 bg-gray-100/80">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Image URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors bg-gray-50/30">
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
                <div className="p-3 rounded-full bg-blue-50">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-medium"
                  >
                    Choose Files
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    or drag and drop files here
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  JPEG, PNG, WebP up to 5MB each
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-3 mt-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddImageUrl}
                className="h-11 px-6"
              >
                Add URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {formData.images && formData.images.length > 0 && (
          <>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {formData.images.length}{" "}
                  {formData.images.length === 1 ? "Image" : "Images"}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {imageType === "upload" ? "Uploaded" : "URL"}
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
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
                    className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                      isMain
                        ? "border-blue-500 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {isMain && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-blue-500 text-white text-xs gap-1">
                          <Star className="h-3 w-3 fill-white" />
                          Main
                        </Badge>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImageAtIndex(index)}
                      className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-red-500 text-gray-700 hover:text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="relative aspect-square bg-gray-50">
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

                    <div className="p-2 bg-white border-t">
                      <p className="text-xs text-gray-600 truncate font-medium">
                        {getImageDisplayName(image)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.images.length > 1 && (
              <div className="space-y-2 pt-2 border-t">
                <Label
                  htmlFor="mainImage"
                  className="text-sm font-medium text-gray-700"
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
                  <SelectTrigger className="h-11 border-gray-200">
                    <SelectValue placeholder="Choose which image appears first" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.images.map((image, index) => (
                      <SelectItem key={index} value={getImageValue(image)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            Image {index + 1}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[180px]">
                            {getImageDisplayName(image)}
                          </span>
                        </div>
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
