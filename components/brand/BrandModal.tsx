// components/brand/BrandModal.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getImageSrc } from "@/lib/utils";
import type { Brand, CreateBrandData } from "@/types/brand";
import { Loader2, X, Upload, Link2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingBrand: Brand | null;
  formData: CreateBrandData;
  setFormData: (data: CreateBrandData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function BrandModal({
  isOpen,
  onClose,
  editingBrand,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: BrandModalProps) {
  const [logoType, setLogoType] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingBrand;

  // Check if a logo exists
  const hasLogo = Boolean(
    formData.logo &&
      (formData.logo instanceof File ||
        (typeof formData.logo === "string" && formData.logo))
  );

  useEffect(() => {
    if (isOpen) {
      if (editingBrand?.logo && editingBrand.logo.startsWith("http")) {
        setLogoType("url");
      } else {
        setLogoType("upload");
      }
      setPreviewUrl("");
    }
  }, [isOpen, editingBrand]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFormData({ ...formData, logo: file });
      setPreviewUrl(URL.createObjectURL(file));
      setLogoType("upload");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, logo: e.target.value });
    setLogoType("url");
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, logo: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplaceImage = () => {
    handleRemoveFile();
    setLogoType("upload");
  };

  const getLogoPreview = () => {
    if (formData.logo instanceof File) {
      return previewUrl;
    }
    if (typeof formData.logo === "string" && formData.logo) {
      return getImageSrc(formData.logo);
    }
    return "";
  };

  const logoPreview = getLogoPreview();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-lg h-[90vh] sm:h-[85vh] flex flex-col border border-gray-200 bg-white p-0 shadow-lg rounded-lg z-[1000]">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 tracking-tight">
            {isEditing ? "Edit Brand" : "Create Brand"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleFormSubmit}
          className="flex-1 flex flex-col min-h-0"
        >
          {/* Main scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-900"
              >
                Brand Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Apple, Nike, Samsung"
                className="h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                The name will appear in your store and search results.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-900"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Brief description of the brand?..."
                className="resize-none border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Optional but recommended for SEO and user understanding.
              </p>
            </div>

            {/* Logo Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">
                Brand Logo
              </Label>

              {/* Logo Preview */}
              {logoPreview && (
                <div className="relative h-40 w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group">
                  <Image
                    src={logoPreview}
                    alt="Brand logo preview"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleReplaceImage}
                      className="h-8 text-xs"
                      disabled={isSubmitting}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Replace
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveFile}
                      className="h-8 text-xs"
                      disabled={isSubmitting}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload/URL Tabs - only show when no logo */}
              {!hasLogo && (
                <Tabs
                  value={logoType}
                  onValueChange={(v) => setLogoType(v as "upload" | "url")}
                >
                  <TabsList className="grid w-full grid-cols-2 h-9 bg-gray-100 rounded-lg p-1">
                    <TabsTrigger
                      value="upload"
                      disabled={isSubmitting}
                      className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Upload className="h-3 w-3 mr-1.5" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger
                      value="url"
                      disabled={isSubmitting}
                      className="text-sm rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Link2 className="h-3 w-3 mr-1.5" />
                      URL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-4 space-y-3">
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        id="logo-file"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload logo
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG, WebP • Max 5MB
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="mt-4 space-y-3">
                    <Input
                      id="logo-url"
                      type="url"
                      value={
                        typeof formData.logo === "string" ? formData.logo : ""
                      }
                      onChange={handleUrlChange}
                      placeholder="https://example.com/logo.png"
                      className="h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                      disabled={isSubmitting}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>

            {/* Website URL */}
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium text-gray-900"
              >
                Website URL
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website || ""}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                placeholder="https://example.com"
                className="h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Optional link to the brand&apos;s official website.
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <Label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Active Status
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Make this brand visible in your store
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-6 pt-4 border-t border-gray-200 shrink-0">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalClose(false)}
                className="flex-1 h-10 rounded-lg border-gray-200 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name}
                className="flex-1 h-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {isEditing ? "Update Brand" : "Create Brand"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
