// app/products/page.tsx
"use client";

import { FilterSidebar } from "@/components/products/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useCategories } from "@/hooks/use-category-hooks";
import { useProducts } from "@/hooks/use-product-queries";
import { ProductsParams } from "@/types/product";
import { useState } from "react";

export default function ProductsPage() {
  // --- STATE MANAGEMENT ---
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("-createdAt");

  // --- DATA FETCHING ---

  // 1. Fetch products based on the current state of filters
  const queryParams: ProductsParams = {
    page,
    limit,
    sort: sortBy,
    "price[gte]": priceRange[0],
    "price[lte]": priceRange[1],
    // Only add filter parameters to the query if they have a value
    ...(selectedRating && { "rating[gte]": selectedRating }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedBrand && { brand: selectedBrand }),
  };

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts(queryParams);

  // 2. Fetch all available categories to populate the filter sidebar
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  // 3. Fetch all available brands to populate the filter sidebar
  const { data: brandsData, isLoading: isLoadingBrands } = useBrands();

  // --- EVENT HANDLERS ---

  // Handlers now correctly use the ID of the category/brand
  const toggleCategory = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    setPage(1); // Reset to the first page whenever a filter changes
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrand((prev) => (prev === brandId ? null : brandId));
    setPage(1);
  };

  const handleRatingFilter = (rating: number) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
    setPage(1);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    // For better performance, a debounce could be added here to avoid excessive API calls while sliding
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([0, 1000]);
    setSelectedRating(null);
    setSortBy("-createdAt");
    setPage(1);
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-10">
          <FilterSidebar
            // Pass the full lists of categories and brands fetched from the API
            categories={categoriesData?.data.categories || []}
            brands={brandsData?.data.brands || []}
            // Let the sidebar know when the filter options themselves are loading
            isLoading={isLoadingCategories || isLoadingBrands}
            // Pass current selections and handlers
            selectedCategory={selectedCategory}
            toggleCategory={toggleCategory}
            selectedBrand={selectedBrand}
            toggleBrand={toggleBrand}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            selectedRating={selectedRating}
            handleRatingFilter={handleRatingFilter}
            resetFilters={resetFilters}
          />
          <ProductGrid
            data={productsData}
            isLoading={isLoadingProducts}
            error={productsError}
            page={page}
            setPage={setPage}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>
    </div>
  );
}
