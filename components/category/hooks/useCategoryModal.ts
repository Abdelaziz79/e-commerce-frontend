// components/category/hooks/useCategoryModal.ts
import { useState, useCallback } from "react";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-category-hooks";
import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";
import { toast } from "sonner";

const initialFormData: CreateCategoryData = {
  name: "",
  description: "",
  image: "",
  parentCategory: null,
  isActive: true,
};

export function useCategoryModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>(initialFormData);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleOpenModal = useCallback((category: Category | null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category?.name,
        description: category?.description || "",
        image: category?.image || "",
        parentCategory: category?.parentCategory || null,
        isActive: category?.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);

    document.body.style.pointerEvents = "";
    document.body.style.removeProperty("pointer-events");

    setTimeout(() => {
      setEditingCategory(null);
      setFormData(initialFormData);
    }, 200);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        const dataToSend: UpdateCategoryData = {};

        for (const key in formData) {
          const typedKey = key as keyof CreateCategoryData;
          const value = formData[typedKey];

          if (value !== "" && value !== undefined && value !== null) {
            (dataToSend[typedKey] as typeof value) = value;
          }
        }

        if (editingCategory) {
          await updateCategory.mutateAsync({
            categoryId: editingCategory._id,
            data: dataToSend,
          });
          toast.success("Category updated successfully!");
        } else {
          await createCategory.mutateAsync(dataToSend as CreateCategoryData);
          toast.success("Category created successfully!");
        }

        handleCloseModal();
      } catch (error) {
        console.error("Failed to save category:", error);
        toast.error("Failed to save category?. Please try again.");
      }
    },
    [
      formData,
      editingCategory,
      createCategory,
      updateCategory,
      handleCloseModal,
    ]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteCategory.mutateAsync(id);
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category?. Please try again.");
      }
    },
    [deleteCategory]
  );

  const isSubmitting =
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending;

  return {
    isModalOpen,
    editingCategory,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isSubmitting,
  };
}
