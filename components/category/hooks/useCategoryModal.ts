// ===== components/category/hooks/useCategoryModal.ts =====
import { useState } from "react";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/use-category-hooks";
import type { Category, CreateCategoryData } from "@/types/category";

export function useCategoryModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
    image: "",
    parentCategory: null,
    isActive: true,
  });

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleOpenModal = (category: Category | null = null) => {
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
      setFormData({
        name: "",
        description: "",
        image: "",
        parentCategory: null,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate({
        categoryId: editingCategory._id,
        data: formData,
      });
    } else {
      createCategoryMutation.mutate(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(categoryId);
    }
  };

  const isSubmitting =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

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
