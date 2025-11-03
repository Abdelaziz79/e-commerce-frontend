// components/brand/hooks/useBrandModal.ts
import { useState } from "react";
import {
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "@/hooks/use-brand-hooks";
import type { Brand, CreateBrandData, UpdateBrandData } from "@/types/brand";

const initialFormData: CreateBrandData = {
  name: "",
  description: "",
  logo: "",
  website: "",
  isActive: true,
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
        isActive: brand.isActive,
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
      // Create a new object that will only contain the valid data to be sent.
      // This approach is fully type-safe and avoids using 'any'.
      const dataToSend: UpdateBrandData = {};

      // Iterate over the keys of the form data in a type-safe way.
      for (const key in formData) {
        const typedKey = key as keyof CreateBrandData;
        const value = formData[typedKey];

        // Add the value to the payload if it's not empty, null, or undefined.
        // We make an exception for the 'isActive' boolean, which should always be included.
        if (value !== "" && value !== undefined && value !== null) {
          // TypeScript understands this assignment is valid because `dataToSend` is a
          // partial and the key/value pairs are derived directly from CreateBrandData.
          (dataToSend[typedKey] as typeof value) = value;
        }
      }

      if (editingBrand) {
        await updateBrand.mutateAsync({
          brandId: editingBrand._id,
          data: dataToSend,
        });
      } else {
        await createBrand.mutateAsync(dataToSend as CreateBrandData);
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
