// components/products/filter-sidebar/FilterSidebar.tsx
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteBrands } from "@/hooks/use-brand-hooks";
import { useInfiniteCategories } from "@/hooks/use-category-hooks";
import { useState } from "react";
import { BrandFilter } from "./BrandFilter";
import { CategoryFilter } from "./CategoryFilter";
import { FilterFooter } from "./FilterFooter";
import { FilterHeader } from "./FilterHeader";
import { FilterSection } from "./FilterSection";
import { FilterSidebarLoading } from "./FilterSidebarLoading";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { ProductSearchInput } from "./ProductSearchInput";
import { RatingFilter } from "./RatingFilter";
import { StatusFilter } from "./StatusFilter"; // Import the new component

interface FilterSidebarProps {
  isLoading: boolean;
  selectedCategory: string | null;
  toggleCategory: (categoryId: string) => void;
  selectedBrand: string | null;
  toggleBrand: (brandId: string) => void;
  priceRange: number[];
  handlePriceChange: (values: number[]) => void;
  selectedRating: number | null;
  handleRatingFilter: (rating: number) => void;
  // New Props
  featured: boolean;
  toggleFeatured: (val: boolean) => void;
  onSale: boolean;
  toggleOnSale: (val: boolean) => void;

  resetFilters: () => void;
  onClose?: () => void;
  searchTerm: string;
  handleSearchChange: (value: string) => void;
}

export function FilterSidebar({
  isLoading,
  selectedCategory,
  toggleCategory,
  selectedBrand,
  toggleBrand,
  priceRange,
  handlePriceChange,
  selectedRating,
  handleRatingFilter,
  featured,
  toggleFeatured,
  onSale,
  toggleOnSale,
  resetFilters,
  onClose,
  searchTerm,
  handleSearchChange,
}: FilterSidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false); // New state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useInfiniteCategories({ limit: 1 });
  const { data: brandsData, isLoading: isBrandsLoading } = useInfiniteBrands({
    limit: 1,
  });

  const hasActiveFilters =
    !!searchTerm ||
    !!selectedCategory ||
    !!selectedBrand ||
    !!selectedRating ||
    featured ||
    onSale ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  const activeFilterCount = [
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedRating,
    featured,
    onSale,
    priceRange[0] > 0 || priceRange[1] < 10000,
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    resetFilters();
    if (onClose) onClose();
  };

  const isComponentLoading = isCategoriesLoading || isBrandsLoading;

  if (isComponentLoading) {
    return <FilterSidebarLoading />;
  }

  const hasCategories =
    (categoriesData?.pages?.[0]?.data?.categories?.length ?? 0) > 0;
  const hasBrands = (brandsData?.pages?.[0]?.data?.brands?.length ?? 0) > 0;

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 h-full flex flex-col">
      <div className="bg-white rounded-none border-r border-gray-200 flex flex-col flex-1 min-h-0">
        <FilterHeader
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-4">
              <FilterSection
                title="Search"
                isOpen={isSearchOpen}
                onToggle={() => setIsSearchOpen(!isSearchOpen)}
                makeBorder={false}
              >
                <ProductSearchInput
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  isLoading={isLoading}
                />
              </FilterSection>

              {/* New Status Section */}
              <FilterSection
                title="Status"
                isOpen={isStatusOpen}
                onToggle={() => setIsStatusOpen(!isStatusOpen)}
              >
                <StatusFilter
                  featured={featured}
                  onToggleFeatured={toggleFeatured}
                  onSale={onSale}
                  onToggleOnSale={toggleOnSale}
                />
              </FilterSection>

              {hasCategories && (
                <FilterSection
                  title="Categories"
                  isOpen={isCategoryOpen}
                  onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
                  makeBorder={true}
                >
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    toggleCategory={toggleCategory}
                  />
                </FilterSection>
              )}

              {hasBrands && (
                <FilterSection
                  title="Brands"
                  isOpen={isBrandOpen}
                  onToggle={() => setIsBrandOpen(!isBrandOpen)}
                >
                  <BrandFilter
                    selectedBrand={selectedBrand}
                    toggleBrand={toggleBrand}
                  />
                </FilterSection>
              )}

              <FilterSection
                title="Price Range"
                isOpen={isPriceOpen}
                onToggle={() => setIsPriceOpen(!isPriceOpen)}
              >
                <PriceRangeFilter
                  priceRange={priceRange}
                  handlePriceChange={handlePriceChange}
                />
              </FilterSection>

              <FilterSection
                title="Rating"
                isOpen={isRatingOpen}
                onToggle={() => setIsRatingOpen(!isRatingOpen)}
              >
                <RatingFilter
                  selectedRating={selectedRating}
                  handleRatingFilter={handleRatingFilter}
                />
              </FilterSection>
            </div>
          </ScrollArea>
        </div>

        {onClose && (
          <FilterFooter
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />
        )}
      </div>
    </aside>
  );
}
