// app/admin/products/create/page.tsx
"use client";

import { BrandModal } from "@/components/brand/BrandModal";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import { CategoryModal } from "@/components/category/CategoryModal";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import { AttributesForm } from "@/components/products/create/AttributesForm";
import { BasicInfoForm } from "@/components/products/create/BasicInfoForm";
import { FormActions } from "@/components/products/create/FormActions";
import { ImageForm } from "@/components/products/create/ImageForm";
import { OrganizationForm } from "@/components/products/create/OrganizationForm";
import { PricingForm } from "@/components/products/create/PricingForm";
import { ProductHeader } from "@/components/products/create/ProductHeader";
import { ProductSettingsForm } from "@/components/products/create/ProductSettingsForm";
import { RelatedProductsForm } from "@/components/products/create/RelatedProductsForm";
import { VariationsForm } from "@/components/products/create/VariationsForm";
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

function CreateProductContent() {
  const createProductMutation = useCreateProduct();

  // Data Fetching for Modals
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

  // Modals
  const brandModal = useBrandModal();
  const categoryModal = useCategoryModal();

  // Main Form State
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
    attributes: {},
    hasVariations: false,
    variations: [],
    relatedProducts: [],
  });

  // UI-specific state
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
    style: "",
  });

  // Generic handler for all form fields
  const handleInputChange = <K extends keyof CreateProductData>(
    field: K,
    value: CreateProductData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        style: "",
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
    const productData: CreateProductData = {
      ...formData,
      ...(showDimensions && { dimensions }),
      ...(showWeight && { weight: weight.value, weightUnit: weight.unit }),
      hasVariations: (formData.variations?.length || 0) > 0,
    };
    createProductMutation.mutate(productData);
  };

  useEffect(() => {
    handleInputChange("hasVariations", (formData.variations?.length || 0) > 0);
  }, [formData.variations]);

  if (isLoadingCategories || isLoadingBrands) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (categoriesError || brandsError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">
          Error fetching modal data:{" "}
          {categoriesError?.message || brandsError?.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProductHeader />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <BasicInfoForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
                <ImageForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                />
                <VariationsForm
                  formData={formData}
                  currentVariation={currentVariation}
                  setCurrentVariation={setCurrentVariation}
                  handleAddVariation={handleAddVariation}
                  handleRemoveVariation={handleRemoveVariation}
                />
                <AttributesForm
                  attributes={formData.attributes || {}}
                  onAttributesChange={(attrs) =>
                    handleInputChange("attributes", attrs)
                  }
                />
                <RelatedProductsForm
                  selectedProductIds={formData.relatedProducts || []}
                  onSelectionChange={(ids) =>
                    handleInputChange("relatedProducts", ids)
                  }
                />
              </div>

              {/* Right Column (Sticks to top on large screens) */}
              <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
                <OrganizationForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  onAddNewCategory={() => categoryModal.handleOpenModal(null)}
                  onAddNewBrand={() => brandModal.handleOpenModal(null)}
                />
                <PricingForm
                  formData={formData}
                  handleInputChange={handleInputChange}
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
              </div>
            </div>

            <FormActions isPending={createProductMutation.isPending} />
          </form>
        </div>
      </div>

      {/* Modals */}
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
      <CreateProductContent />
    </ProtectedRoute>
  );
}
