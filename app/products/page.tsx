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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- 1. READ STATE FROM URL (Source of Truth) ---
  const page = Number(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sort") || "-createdAt";
  const selectedCategory = searchParams.get("category");
  const selectedBrand = searchParams.get("brand");
  const selectedRating = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : null;
  const featured = searchParams.get("featured") === "true";
  const onSale = searchParams.get("onSale") === "true";

  // --- 2. LOCAL STATE (Only for Debounced/Controlled Inputs) ---
  // We initialize these from URL, but they live in state to allow typing/sliding without URL lag
  const urlSearch = searchParams.get("search") || "";
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 10000;

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [priceRange, setPriceRange] = useState([urlMinPrice, urlMaxPrice]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync local state if URL changes externally (e.g. Back button for search/price)
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [urlMinPrice, urlMaxPrice]);

  // Debounce the local state inputs
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // --- 3. HELPER: UPDATE URL ---
  const createQueryString = useCallback(
    (params: Record<string, string | number | boolean | null | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === false
        ) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const updateUrl = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      const queryString = createQueryString(updates);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [createQueryString, pathname, router]
  );

  // --- 4. EFFECTS FOR DEBOUNCED INPUTS ---

  // Effect: Update URL when Debounced Search changes
  useEffect(() => {
    if (debouncedSearchTerm !== urlSearch) {
      updateUrl({ search: debouncedSearchTerm, page: 1 });
    }
  }, [debouncedSearchTerm, urlSearch, updateUrl]);

  // Effect: Update URL when Debounced Price changes
  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    if (min !== urlMinPrice || max !== urlMaxPrice) {
      updateUrl({
        minPrice: min > 0 ? min : null,
        maxPrice: max < 10000 ? max : null,
        page: 1,
      });
    }
  }, [debouncedPriceRange, urlMinPrice, urlMaxPrice, updateUrl]);

  // --- 5. EVENT HANDLERS (Immediate URL Updates) ---

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (categoryId: string) => {
    updateUrl({
      category: selectedCategory === categoryId ? null : categoryId,
      page: 1,
    });
  };

  const toggleBrand = (brandId: string) => {
    updateUrl({
      brand: selectedBrand === brandId ? null : brandId,
      page: 1,
    });
  };

  const toggleFeatured = (val: boolean) => {
    updateUrl({ featured: val || null, page: 1 });
  };

  const toggleOnSale = (val: boolean) => {
    updateUrl({ onSale: val || null, page: 1 });
  };

  const handleRatingFilter = (rating: number) => {
    updateUrl({
      rating: selectedRating === rating ? null : rating,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    updateUrl({ sort: value, page: 1 });
  };

  // Handlers for local state (Search & Price)
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const resetFilters = () => {
    router.push(pathname); // Clear all params
  };

  // --- 6. API QUERY PARAMS ---
  const queryParams: ProductsParams = useMemo(
    () => ({
      page,
      limit: 12,
      sort: sortBy,
      "price[gte]": urlMinPrice,
      "price[lte]": urlMaxPrice,
      ...(selectedRating && { "rating[gte]": selectedRating }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedBrand && { brand: selectedBrand }),
      ...(urlSearch && { search: urlSearch }),
      ...(featured && { featured: true }),
      ...(onSale && { onSale: true }),
    }),
    [
      page,
      sortBy,
      urlMinPrice,
      urlMaxPrice,
      selectedRating,
      selectedCategory,
      selectedBrand,
      urlSearch,
      featured,
      onSale,
    ]
  );

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useProducts(queryParams);

  // Count active filters for UI badge
  const activeFilterCount = [
    selectedCategory,
    selectedBrand,
    selectedRating,
    urlSearch,
    featured,
    onSale,
    urlMinPrice > 0 || urlMaxPrice < 10000,
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
                  Filter products by category, brand, price, rating, and name.
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
                featured={featured}
                toggleFeatured={toggleFeatured}
                onSale={onSale}
                toggleOnSale={toggleOnSale}
                resetFilters={resetFilters}
                onClose={() => setMobileFiltersOpen(false)}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
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
              featured={featured}
              toggleFeatured={toggleFeatured}
              onSale={onSale}
              toggleOnSale={toggleOnSale}
              resetFilters={resetFilters}
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
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
              onResetFilters={resetFilters} // Pass reset logic to grid/empty state
            />
          </div>
        </div>
      </div>
    </div>
  );
}
