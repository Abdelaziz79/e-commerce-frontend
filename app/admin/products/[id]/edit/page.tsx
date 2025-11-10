// app/admin/products/[id]/edit/page.tsx
"use client";

import { BrandModal } from "@/components/brand/BrandModal";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import { CategoryModal } from "@/components/category/CategoryModal";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import { AttributesForm } from "@/components/products/create/AttributesForm";
import { BasicInfoForm } from "@/components/products/create/BasicInfoForm";
import { ImageForm } from "@/components/products/create/ImageForm";
import { OrganizationForm } from "@/components/products/create/OrganizationForm";
import { PricingForm } from "@/components/products/create/PricingForm";
import { ProductSettingsForm } from "@/components/products/create/ProductSettingsForm";
import { RelatedProductsForm } from "@/components/products/create/RelatedProductsForm";
import { VariationsForm } from "@/components/products/create/VariationsForm";
import { FormActions } from "@/components/products/edit/FormActions";
import { ProductHeader } from "@/components/products/edit/ProductHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useCategories } from "@/hooks/use-category-hooks";
import { useUpdateProduct } from "@/hooks/use-product-mutations";
import { useProduct } from "@/hooks/use-product-queries";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import {
  CreateProductData,
  Product,
  ProductDimensions,
  ProductVariation,
} from "@/types/product";
import { AlertCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function EditProductContent() {
  const params = useParams();
  const productId = params.id as string;

  // Fetch existing product data
  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: productError,
  } = useProduct(productId);

  const product_id = productData?.data._id as string;

  const updateProductMutation = useUpdateProduct();

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

  // Helper function to convert ISO date to datetime-local format
  const formatDateForInput = (isoDate: string | undefined): string => {
    if (!isoDate) return "";
    try {
      // Create date object and convert to local datetime-local format
      const date = new Date(isoDate);
      // Format: YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Populate form with existing product data
  useEffect(() => {
    if (productData?.data) {
      const product = productData.data as Product;

      // Extract category and brand IDs
      const categoryId =
        typeof product.category === "string"
          ? product.category
          : (product.category as Category)?._id || "";

      const brandId =
        typeof product.brand === "string"
          ? product.brand
          : (product.brand as Brand)?._id || "";

      // Extract related product IDs
      const relatedProductIds =
        product.relatedProducts?.map((rp) =>
          typeof rp === "string" ? rp : rp._id
        ) || [];

      setFormData({
        name: product.name || "",
        description: product.description || "",
        richDescription: product.richDescription || "",
        price: product.price || 0,
        category: categoryId,
        brand: brandId,
        countInStock: product.countInStock || 0,
        images: product.images || [],
        mainImage: product.mainImage || undefined,
        featured: product.featured || false,
        isNewProduct: product.isNewProduct || false,
        onSale: product.onSale || false,
        salePrice: product.salePrice || 0,
        saleEndDate: formatDateForInput(product.saleEndDate),
        tags: product.tags || [],
        attributes: product.attributes || {},
        hasVariations: product.hasVariations || false,
        variations: product.variations || [],
        relatedProducts: relatedProductIds,
        warranty: product.warranty || "",
      });

      // Set dimensions if they exist
      if (product.dimensions) {
        setShowDimensions(true);
        setDimensions(product.dimensions);
      }

      // Set weight if it exists
      if (product.weight) {
        setShowWeight(true);
        setWeight({
          value: product.weight,
          unit: product.weightUnit || "kg",
        });
      }
    }
  }, [productData]);

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
    updateProductMutation.mutate({ productId: product_id, data: productData });
  };

  useEffect(() => {
    handleInputChange("hasVariations", (formData.variations?.length || 0) > 0);
  }, [formData.variations]);

  if (isLoadingProduct || isLoadingCategories || isLoadingBrands) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 text-lg font-semibold">
          Error loading product
        </p>
        <p className="text-gray-600 mt-2">
          {productError?.message || "Product not found"}
        </p>
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
          <ProductHeader productName={formData.name} productId={productId} />
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

            <FormActions
              isPending={updateProductMutation.isPending}
              productId={productId}
            />
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

export default function EditProductPage() {
  return (
    <ProtectedRoute userType="admin">
      <EditProductContent />
    </ProtectedRoute>
  );
}
