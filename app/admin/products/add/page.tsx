// app/admin/products/add/page.tsx
"use client";

import { BrandModal } from "@/components/brand/BrandModal";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import { CategoryModal } from "@/components/category/CategoryModal";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import { BasicInfoForm } from "@/components/products/add/BasicInfoForm";
import { CategoryTagForm } from "@/components/products/add/CategoryTagForm";
import { FormActions } from "@/components/products/add/FormActions";
import { ImageForm } from "@/components/products/add/ImageForm";
import { PricingInventoryForm } from "@/components/products/add/PricingInventoryForm";
import { ProductHeader } from "@/components/products/add/ProductHeader";
import { ProductSettingsForm } from "@/components/products/add/ProductSettingsForm";
import { VariationsForm } from "@/components/products/add/VariationsForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useCategories } from "@/hooks/use-category-hooks";
import { useCreateProduct } from "@/hooks/use-product-mutations";
import {
  CreateProductData,
  ProductDimensions,
  ProductVariation,
} from "@/types/product";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

function AddProductContent() {
  const createProductMutation = useCreateProduct();

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();
  const {
    data: brandsData,
    isLoading: isLoadingBrands,
    error: brandsError,
  } = useBrands();

  // Modal hooks
  const brandModal = useBrandModal();
  const categoryModal = useCategoryModal();

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    description: "",
    richDescription: "",
    price: 0,
    category: "",
    brand: "",
    countInStock: 0,
    images: [],
    mainImage: undefined,
    featured: false,
    isNewProduct: true,
    onSale: false,
    salePrice: 0,
    tags: [],
    hasVariations: false,
    variations: [],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [showDimensions, setShowDimensions] = useState(false);
  const [showWeight, setShowWeight] = useState(false);
  const [dimensions, setDimensions] = useState<ProductDimensions>({
    length: 0,
    width: 0,
    height: 0,
    unit: "cm",
  });
  const [weight, setWeight] = useState({
    value: 0,
    unit: "kg" as "kg" | "g" | "lb" | "oz",
  });
  const [currentVariation, setCurrentVariation] = useState<ProductVariation>({
    sku: "",
    price: 0,
    countInStock: 0,
    size: "",
    color: "",
    material: "",
  });

  // Updated to handle all possible types
  const handleInputChange = <K extends keyof CreateProductData>(
    field: K,
    value: CreateProductData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      handleInputChange("tags", [...(formData.tags || []), currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      "tags",
      formData.tags?.filter((tag) => tag !== tagToRemove) || []
    );
  };

  const handleAddVariation = () => {
    if (currentVariation.sku.trim()) {
      handleInputChange("variations", [
        ...(formData.variations || []),
        currentVariation,
      ]);
      setCurrentVariation({
        sku: "",
        price: 0,
        countInStock: 0,
        size: "",
        color: "",
        material: "",
      });
    }
  };

  const handleRemoveVariation = (indexToRemove: number) => {
    handleInputChange(
      "variations",
      formData.variations?.filter((_, i) => i !== indexToRemove) || []
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build product data, excluding undefined/empty optional fields
    const productData: CreateProductData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      brand: formData.brand,
      countInStock: formData.countInStock,
      images: formData.images,
      ...(formData.mainImage && { mainImage: formData.mainImage }),
      ...(formData.richDescription && {
        richDescription: formData.richDescription,
      }),
      ...(formData.featured !== undefined && { featured: formData.featured }),
      ...(formData.isNewProduct !== undefined && {
        isNewProduct: formData.isNewProduct,
      }),
      ...(formData.onSale !== undefined && { onSale: formData.onSale }),
      ...(formData.onSale &&
        formData.salePrice && { salePrice: formData.salePrice }),
      ...(formData.onSale &&
        formData.saleEndDate && { saleEndDate: formData.saleEndDate }),
      ...(formData.tags && formData.tags.length > 0 && { tags: formData.tags }),
      ...(formData.variations &&
        formData.variations.length > 0 && {
          hasVariations: true,
          variations: formData.variations,
        }),
      ...(showDimensions && { dimensions }),
      ...(showWeight && { weight: weight.value, weightUnit: weight.unit }),
    };

    createProductMutation.mutate(productData);
  };

  useEffect(() => {
    handleInputChange("hasVariations", (formData.variations?.length || 0) > 0);
  }, [formData.variations]);

  if (isLoadingCategories || isLoadingBrands) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (categoriesError || brandsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Error fetching data:{" "}
          {categoriesError?.message || brandsError?.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ProductHeader />
          <form onSubmit={handleSubmit} className="space-y-8">
            <BasicInfoForm
              formData={formData}
              handleInputChange={handleInputChange}
              brands={brandsData?.data.brands || []}
              onAddNewBrand={() => brandModal.handleOpenModal(null)}
            />
            <PricingInventoryForm
              formData={formData}
              handleInputChange={handleInputChange}
              categories={categoriesData?.data.categories || []}
              onAddNewCategory={() => categoryModal.handleOpenModal(null)}
            />
            <ImageForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <CategoryTagForm
              formData={formData}
              currentTag={currentTag}
              setCurrentTag={setCurrentTag}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
            />
            <VariationsForm
              formData={formData}
              currentVariation={currentVariation}
              setCurrentVariation={setCurrentVariation}
              handleAddVariation={handleAddVariation}
              handleRemoveVariation={handleRemoveVariation}
            />
            <ProductSettingsForm
              formData={formData}
              handleInputChange={handleInputChange}
              showDimensions={showDimensions}
              setShowDimensions={setShowDimensions}
              showWeight={showWeight}
              setShowWeight={setShowWeight}
              dimensions={dimensions}
              setDimensions={setDimensions}
              weight={weight}
              setWeight={setWeight}
            />
            <FormActions isPending={createProductMutation.isPending} />
          </form>
        </div>
      </div>

      {/* Render Modals */}
      <BrandModal
        isOpen={brandModal.isModalOpen}
        onClose={brandModal.handleCloseModal}
        editingBrand={brandModal.editingBrand}
        formData={brandModal.formData}
        setFormData={brandModal.setFormData}
        onSubmit={brandModal.handleSubmit}
        isSubmitting={brandModal.isSubmitting}
      />

      <CategoryModal
        isOpen={categoryModal.isModalOpen}
        onClose={categoryModal.handleCloseModal}
        editingCategory={categoryModal.editingCategory}
        formData={categoryModal.formData}
        setFormData={categoryModal.setFormData}
        onSubmit={categoryModal.handleSubmit}
        categories={categoriesData?.data.categories || []}
        isSubmitting={categoryModal.isSubmitting}
      />
    </>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute userType="admin">
      <AddProductContent />
    </ProtectedRoute>
  );
}
