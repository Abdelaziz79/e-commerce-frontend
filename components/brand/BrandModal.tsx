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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Brand, CreateBrandData } from "@/types/brand";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Switch } from "../ui/switch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

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

  // Effect to set the correct tab when the modal opens for editing
  useEffect(() => {
    if (isOpen) {
      if (editingBrand?.logo && editingBrand.logo.startsWith("http")) {
        setLogoType("url");
      } else {
        setLogoType("upload");
      }
      // Clear any previous file previews when modal opens
      setPreviewUrl("");
    }
  }, [isOpen, editingBrand]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setFormData({ ...formData, logo: file });
      setPreviewUrl(URL.createObjectURL(file));
      // Switch to the upload tab for better UX
      setLogoType("upload");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, logo: e.target.value });
    // Switch to the URL tab for better UX
    setLogoType("url");
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, logo: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getLogoPreview = () => {
    if (formData.logo instanceof File) {
      return previewUrl;
    }
    if (typeof formData.logo === "string" && formData.logo) {
      if (formData.logo.startsWith("/uploads/")) {
        return `${API_BASE_URL}${formData.logo}`;
      }
      return formData.logo;
    }
    return "";
  };

  const logoPreview = getLogoPreview();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingBrand ? "Edit Brand" : "Create Brand"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-2">
          {/* ... other form fields (Name, Description) remain the same */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Apple, Nike, Samsung..."
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description of the brand"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Logo</Label>

            <Tabs
              value={logoType}
              onValueChange={(v) => setLogoType(v as "upload" | "url")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="url">Use URL</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    ref={fileInputRef}
                    id="logo-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="h-10"
                  />
                  {formData.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-10 w-10 shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPEG, PNG, WebP (Max 5MB)
                </p>
              </TabsContent>

              <TabsContent value="url" className="space-y-3">
                <Input
                  id="logo-url"
                  type="url"
                  value={typeof formData.logo === "string" ? formData.logo : ""}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/logo.png"
                  className="h-10"
                />
              </TabsContent>
            </Tabs>

            {logoPreview && (
              <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden mt-3 flex items-center justify-center">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-contain p-8"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
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
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label
                htmlFor="isActive"
                className="text-sm font-medium cursor-pointer"
              >
                Active Status
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this Brand visible to customers
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingBrand ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
