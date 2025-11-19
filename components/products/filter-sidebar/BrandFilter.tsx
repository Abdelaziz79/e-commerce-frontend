"use client";

import { useDebounce } from "@/hooks/use-debounce";
import {
  useInfiniteBrands,
  useSearchBrands,
  useBrand,
} from "@/hooks/use-brand-hooks";
import { Brand } from "@/types/brand";
import { useMemo, useState } from "react";
import { FilterableList } from "./FilterableList";

interface BrandFilterProps {
  selectedBrand: string | null;
  toggleBrand: (brandId: string) => void;
}

export function BrandFilter({ selectedBrand, toggleBrand }: BrandFilterProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const debouncedBrandSearch = useDebounce(brandSearch, 300);

  const {
    data: brandsData,
    fetchNextPage: fetchNextBrands,
    hasNextPage: hasNextBrandsPage,
    isFetchingNextPage: isFetchingNextBrands,
    isLoading: isBrandsLoading,
  } = useInfiniteBrands({ limit: 20 });

  const { data: brandSearchResults, isLoading: isBrandSearching } =
    useSearchBrands(
      { q: debouncedBrandSearch },
      { enabled: debouncedBrandSearch.length > 0 }
    );

  const allBrands = useMemo(
    () => brandsData?.pages.flatMap((page) => page.data.brands) ?? [],
    [brandsData]
  );

  // Check if selected brand is in the current list
  const isSelectedInList = useMemo(() => {
    if (!selectedBrand) return true;
    return allBrands.some((brand) => brand?._id === selectedBrand);
  }, [selectedBrand, allBrands]);

  // Fetch the selected brand if it's not in the paginated list and not searching
  const { data: selectedBrandData } = useBrand(selectedBrand || "");

  const displayBrands = useMemo(() => {
    let brands: Brand[];

    if (debouncedBrandSearch && brandSearchResults?.data.brands) {
      // Show search results
      brands = brandSearchResults.data.brands;
    } else {
      // Show paginated results
      brands = [...allBrands];

      // If there's a selected brand not in the list, add it to the top
      if (
        selectedBrand &&
        !isSelectedInList &&
        selectedBrandData?.data?.brand
      ) {
        brands = [selectedBrandData.data.brand, ...brands];
      }
    }

    return brands;
  }, [
    debouncedBrandSearch,
    brandSearchResults,
    allBrands,
    selectedBrand,
    isSelectedInList,
    selectedBrandData,
  ]);

  return (
    <FilterableList<Brand>
      items={displayBrands}
      selectedItem={selectedBrand}
      onSelectItem={toggleBrand}
      isLoading={isBrandsLoading}
      isSearching={isBrandSearching}
      searchValue={brandSearch}
      onSearchChange={setBrandSearch}
      hasNextPage={hasNextBrandsPage && !debouncedBrandSearch}
      fetchNextPage={fetchNextBrands}
      isFetchingNextPage={isFetchingNextBrands}
      searchPlaceholder="Search brands..."
      noItemsText="No brands available"
      noSearchResultsText="No brands found"
    />
  );
}
