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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category, CreateCategoryData } from "@/types/category";
import {
  Loader2,
  X,
  Search,
  ChevronDown,
  Upload,
  Link2,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchableInfiniteAdminCategories } from "@/hooks/use-category-hooks";
import { getImageSrc } from "@/lib/utils";
import { toast } from "sonner";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  formData: CreateCategoryData;
  setFormData: (data: CreateCategoryData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  editingCategory,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: CategoryModalProps) {
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchableInfiniteAdminCategories(
      categorySearch,
      formData.parentCategory ?? null
    );

  // Check if an image exists
  const hasImage = Boolean(
    formData.image &&
      (formData.image instanceof File ||
        (typeof formData.image === "string" && formData.image))
  );

  useEffect(() => {
    if (isOpen) {
      if (editingCategory?.image && editingCategory.image.startsWith("http")) {
        setImageType("url");
      } else {
        setImageType("upload");
      }
      setPreviewUrl("");
      setCategorySearch("");
    }
  }, [isOpen, editingCategory]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    }

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCategoryDropdown]);

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

      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
      setImageType("upload");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, image: e.target.value });
    setImageType("url");
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, image: "" });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplaceImage = () => {
    handleRemoveFile();
    setImageType("upload");
  };

  const getImagePreview = () => {
    if (formData.image instanceof File) {
      return previewUrl;
    }
    if (typeof formData.image === "string" && formData.image) {
      return getImageSrc(formData.image);
    }
    return "";
  };

  const imagePreview = getImagePreview();
  const isEditing = !!editingCategory;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(e);
  };

  const selectedCategory = items.find(
    (cat) => cat._id === formData.parentCategory
  );
  const selectedCategoryName = selectedCategory?.name || "None (Top-level)";
  const filteredItems = items.filter((cat) => cat._id !== editingCategory?._id);

  const handleModalClose = (open: boolean) => {
    if (!open) {
      setShowCategoryDropdown(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-lg h-[90vh] sm:h-[85vh] flex flex-col border border-gray-200 bg-white p-0 shadow-lg rounded-lg z-[1000]">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 shrink-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 tracking-tight">
            {isEditing ? "Edit Category" : "Create Category"}
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
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Electronics"
                className="h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                The name will appear in your store navigation and search
                results.
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
                placeholder="Brief description of the category?..."
                className="resize-none border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Optional but recommended for SEO and user understanding.
              </p>
            </div>

            {/* Image Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">
                Category Image
              </Label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative h-40 w-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group">
                  <Image
                    src={imagePreview}
                    alt="Category image preview"
                    fill
                    className="object-cover"
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

              {/* Upload/URL Tabs - only show when no image */}
              {!hasImage && (
                <Tabs
                  value={imageType}
                  onValueChange={(v) => setImageType(v as "upload" | "url")}
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
                        id="image-file"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG, WebP • Max 5MB
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="mt-4 space-y-3">
                    <Input
                      id="image-url"
                      type="url"
                      value={
                        typeof formData.image === "string" ? formData.image : ""
                      }
                      onChange={handleUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="h-10 border-gray-200 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                      disabled={isSubmitting}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>

            {/* Parent Category Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Parent Category
              </Label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  disabled={isSubmitting}
                  className="w-full h-10 px-4 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span
                    className={
                      formData.parentCategory
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {selectedCategoryName}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showCategoryDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute z-[2000] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden bottom-full mb-2">
                    <div className="p-2 border-b border-gray-200 bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Search categories..."
                          className="pl-9 h-9 text-sm border-0 focus:ring-0 bg-white rounded-lg"
                          autoFocus
                        />
                      </div>
                    </div>

                    <ScrollArea className="max-h-48 overflow-y-auto">
                      <div className="py-1">
                        {/* None option */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, parentCategory: null });
                            setShowCategoryDropdown(false);
                            setCategorySearch("");
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center"
                        >
                          {!formData.parentCategory && (
                            <span className="mr-2 text-gray-900 font-bold">
                              ✓
                            </span>
                          )}
                          <span className="text-gray-700">
                            None (Top-level)
                          </span>
                        </button>

                        {isLoading && !isFetchingNextPage ? (
                          <div className="flex justify-center p-4">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                          </div>
                        ) : filteredItems.length === 0 ? (
                          <div className="text-center p-4 text-sm text-gray-500">
                            No categories found
                          </div>
                        ) : (
                          <>
                            {filteredItems.map((category) => (
                              <button
                                key={category?._id}
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    parentCategory: category?._id,
                                  });
                                  setShowCategoryDropdown(false);
                                  setCategorySearch("");
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center"
                              >
                                {formData.parentCategory === category?._id && (
                                  <span className="mr-2 text-gray-900 font-bold">
                                    ✓
                                  </span>
                                )}
                                <span className="text-gray-700">
                                  {category?.name}
                                </span>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Load More - always visible */}
                    {hasNextPage && (
                      <div className="border-t border-gray-200 p-2 bg-gray-50">
                        <button
                          type="button"
                          className="w-full h-8 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center rounded transition-colors"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          ) : (
                            "Load More"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Optional: Set a parent category to create hierarchy.
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
                  Make this category visible in your store
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
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
