"use client";

import { FilterSidebar } from "@/components/products/filter-sidebar/FilterSidebar";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import { useProducts } from "@/hooks/use-product-queries";
import { ProductsParams } from "@/types/product";
import { SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ProductsPage() {
  // --- STATE MANAGEMENT ---
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce price range to avoid excessive API calls
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // --- DATA FETCHING (PRODUCTS ONLY) ---
  const queryParams: ProductsParams = {
    page,
    limit,
    sort: sortBy,
    "price[gte]": debouncedPriceRange[0],
    "price[lte]": debouncedPriceRange[1],
    ...(selectedRating && { "rating[gte]": selectedRating }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedBrand && { brand: selectedBrand }),
  };

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts(queryParams);

  // --- EVENT HANDLERS ---
  const toggleCategory = useCallback((categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    setPage(1);
  }, []);

  const toggleBrand = useCallback((brandId: string) => {
    setSelectedBrand((prev) => (prev === brandId ? null : brandId));
    setPage(1);
  }, []);

  const handleRatingFilter = useCallback((rating: number) => {
    setSelectedRating((prev) => (prev === rating ? null : rating));
    setPage(1);
  }, []);

  const handlePriceChange = useCallback((values: number[]) => {
    setPriceRange(values);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedPriceRange]);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange([0, 1000]);
    setSelectedRating(null);
    setSortBy("-createdAt");
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Count active filters
  const activeFilterCount = [
    selectedCategory,
    selectedBrand,
    selectedRating,
    priceRange[0] > 0 || priceRange[1] < 1000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-6">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full h-10">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
              <SheetHeader className="sr-only">
                <SheetTitle>Product Filters</SheetTitle>
                <SheetDescription>
                  Filter products by category, brand, price, and rating. This
                  title is hidden but required for screen readers.
                </SheetDescription>
              </SheetHeader>
              <FilterSidebar
                isLoading={isLoadingProducts}
                selectedCategory={selectedCategory}
                toggleCategory={toggleCategory}
                selectedBrand={selectedBrand}
                toggleBrand={toggleBrand}
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
                selectedRating={selectedRating}
                handleRatingFilter={handleRatingFilter}
                resetFilters={resetFilters}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Layout */}
        <div className="flex flex-col lg:flex-row ">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              isLoading={isLoadingProducts}
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
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              data={productsData}
              isLoading={isLoadingProducts}
              error={productsError}
              page={page}
              setPage={handlePageChange}
              sortBy={sortBy}
              setSortBy={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
