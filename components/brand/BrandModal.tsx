// ===== components/brand/BrandModal.tsx =====
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Brand, CreateBrandData } from "@/types/brand";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingBrand ? "Edit Brand" : "Create Brand"}
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
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description of the brand"
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium">
              Logo URL
            </Label>
            <Input
              id="logo"
              type="url"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              placeholder="https://example.com/logo.png"
              className="h-10"
            />
            {formData.logo && (
              <div className="relative h-32 w-full bg-muted rounded-lg overflow-hidden mt-3 flex items-center justify-center">
                <Image
                  src={formData.logo}
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
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
              className="h-10"
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
