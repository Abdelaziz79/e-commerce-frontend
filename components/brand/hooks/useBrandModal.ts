// ===== components/brand/hooks/useBrandModal.ts =====
import { useState } from "react";
import {
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "@/hooks/use-brand-hooks";
import type { Brand, CreateBrandData } from "@/types/brand";

const initialFormData: CreateBrandData = {
  name: "",
  description: "",
  logo: "",
  website: "",
};

export function useBrandModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandData>(initialFormData);

  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const handleOpenModal = (brand: Brand | null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
      });
    } else {
      setEditingBrand(null);
      setFormData(initialFormData);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBrand) {
        await updateBrand.mutateAsync({
          brandId: editingBrand._id,
          data: formData,
        });
      } else {
        await createBrand.mutateAsync(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save brand:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete brand:", error);
      }
    }
  };

  const isSubmitting =
    createBrand.isPending || updateBrand.isPending || deleteBrand.isPending;

  return {
    isModalOpen,
    editingBrand,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isSubmitting,
  };
}
