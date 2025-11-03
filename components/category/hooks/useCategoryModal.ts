// components/category/hooks/useCategoryModal.ts
import { useState } from "react";
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

  const handleOpenModal = (category: Category | null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        parentCategory: category.parentCategory || null,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a new object that will only contain the valid data to be sent.
      // This approach is fully type-safe and avoids using 'any'.
      const dataToSend: UpdateCategoryData = {};

      // Iterate over the keys of the form data in a type-safe way.
      for (const key in formData) {
        const typedKey = key as keyof CreateCategoryData;
        const value = formData[typedKey];

        // Add the value to the payload if it's not empty, null, or undefined.
        // We make an exception for the 'isActive' boolean, which should always be included.
        if (value !== "" && value !== undefined && value !== null) {
          // TypeScript understands this assignment is valid because `dataToSend` is a
          // partial and the key/value pairs are derived directly from CreateCategoryData.
          (dataToSend[typedKey] as typeof value) = value;
        }
      }

      if (editingCategory) {
        await updateCategory.mutateAsync({
          categoryId: editingCategory._id,
          data: dataToSend,
        });
      } else {
        await createCategory.mutateAsync(dataToSend as CreateCategoryData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

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
