// app/products/components/FilterSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  selectedCategory: string | null;
  toggleCategory: (categoryId: string) => void;
  selectedBrand: string | null;
  toggleBrand: (brandId: string) => void;
  priceRange: number[];
  handlePriceChange: (values: number[]) => void;
  selectedRating: number | null;
  handleRatingFilter: (rating: number) => void;
  resetFilters: () => void;
}

export function FilterSidebar({
  categories,
  brands,
  isLoading,
  selectedCategory,
  toggleCategory,
  selectedBrand,
  toggleBrand,
  priceRange,
  handlePriceChange,
  selectedRating,
  handleRatingFilter,
  resetFilters,
}: FilterSidebarProps) {
  const FilterSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-5 w-2/5" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );

  return (
    <div className="md:w-72 flex-shrink-0">
      <Card className="sticky top-24 bg-white/80 border-gray-200 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        <CardContent className="p-6">
          <h2 className="font-bold text-xl mb-6 text-gray-800">Filters</h2>

          {isLoading ? (
            <div className="space-y-6">
              <FilterSkeleton />
              <Separator />
              <FilterSkeleton />
            </div>
          ) : (
            <>
              {/* Category Filter */}
              {categories.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Toggle
                          key={category._id}
                          pressed={selectedCategory === category._id}
                          onPressedChange={() => toggleCategory(category._id)}
                          aria-label={`Filter by ${category.name}`}
                          className="data-[state=on]:bg-gray-800 data-[state=on]:text-white transition-colors duration-200 w-full justify-start text-sm rounded-md"
                        >
                          {category.name}
                        </Toggle>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-5" />
                </>
              )}

              {/* Brand Filter */}
              {brands.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Brand</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <Toggle
                          key={brand._id}
                          pressed={selectedBrand === brand._id}
                          onPressedChange={() => toggleBrand(brand._id)}
                          aria-label={`Filter by ${brand.name}`}
                          className="data-[state=on]:bg-gray-800 data-[state=on]:text-white transition-colors duration-200 w-full justify-start text-sm rounded-md"
                        >
                          {brand.name}
                        </Toggle>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-5" />
                </>
              )}
            </>
          )}

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-4">Price Range</h3>
            <div className="px-1">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={1000}
                step={10}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Rating Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <Toggle
                  key={rating}
                  pressed={selectedRating === rating}
                  onPressedChange={() => handleRatingFilter(rating)}
                  aria-label={`${rating} stars and up`}
                  className="w-full justify-start data-[state=on]:bg-gray-800 data-[state=on]:text-white transition-colors duration-200 text-sm rounded-md"
                >
                  <div className="flex items-center">
                    {/* ... star SVG icons */}
                    <span className="ml-2 text-gray-700">& Up</span>
                  </div>
                </Toggle>
              ))}
            </div>
          </div>

          <Separator className="my-5" />

          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full transition-colors border-gray-300 hover:bg-gray-100 rounded-md"
          >
            Reset All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
