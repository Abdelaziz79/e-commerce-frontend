// ===== components/category/CategoryModal.tsx =====
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
import { Textarea } from "@/components/ui/textarea";
import type { Category, CreateCategoryData } from "@/types/category";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description of the category"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Image URL
            </Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              className="h-10"
            />
            {formData.image && (
              <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden mt-3">
                <Image
                  src={formData.image}
                  alt="Preview"
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
            <div className="space-y-0.5">
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
