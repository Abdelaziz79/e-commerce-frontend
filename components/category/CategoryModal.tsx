// components/category/CategoryModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Category, CreateCategoryData } from "@/types/category";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  formData: CreateCategoryData;
  setFormData: (data: CreateCategoryData) => void;
  onSubmit: (e: React.FormEvent) => void;
  categories: Category[];
  isSubmitting: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  editingCategory,
  formData,
  setFormData,
  onSubmit,
  categories,
  isSubmitting,
}: CategoryModalProps) {
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to set the correct tab when the modal opens for editing
  useEffect(() => {
    if (isOpen) {
      if (editingCategory?.image && editingCategory.image.startsWith("http")) {
        setImageType("url");
      } else {
        setImageType("upload");
      }
      // Clear any previous file previews when modal opens
      setPreviewUrl("");
    }
  }, [isOpen, editingCategory]);

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

      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
      // Switch to the upload tab for better UX
      setImageType("upload");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, image: e.target.value });
    // Switch to the URL tab for better UX
    setImageType("url");
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, image: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImagePreview = () => {
    if (formData.image instanceof File) {
      return previewUrl;
    }
    if (typeof formData.image === "string" && formData.image) {
      if (formData.image.startsWith("/uploads/")) {
        return `${API_BASE_URL}${formData.image}`;
      }
      return formData.image;
    }
    return "";
  };

  const imagePreview = getImagePreview();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingCategory ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 mt-2">
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
              placeholder="Electronics"
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
              placeholder="Brief description of the category"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Image</Label>

            <Tabs
              value={imageType}
              onValueChange={(v) => setImageType(v as "upload" | "url")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="url">Use URL</TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    ref={fileInputRef}
                    id="image-file"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="h-10"
                  />
                  {formData.image && (
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
                  id="image-url"
                  type="url"
                  value={
                    typeof formData.image === "string" ? formData.image : ""
                  }
                  onChange={handleUrlChange}
                  placeholder="https://example.com/image.jpg"
                  className="h-10"
                />
              </TabsContent>
            </Tabs>

            {imagePreview && (
              <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden mt-3">
                <Image
                  src={imagePreview}
                  alt="Image preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent" className="text-sm font-medium">
              Parent Category
            </Label>
            <Select
              value={formData.parentCategory || "none"}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  parentCategory: v === "none" ? null : v,
                })
              }
            >
              <SelectTrigger id="parent" className="h-10">
                <SelectValue placeholder="None (Top-level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top-level)</SelectItem>
                {categories
                  .filter(
                    (cat) => !editingCategory || cat._id !== editingCategory._id
                  )
                  .map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label
                htmlFor="isActive"
                className="text-sm font-medium cursor-pointer"
              >
                Active Status
              </Label>
              <p className="text-xs text-muted-foreground">
                Make this category visible to customers
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
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
