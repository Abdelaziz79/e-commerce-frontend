// app/brands/page.tsx
"use client";

import { BrandGrid } from "@/components/brand/user/BrandGrid";
import { BrandHeader } from "@/components/brand/user/BrandHeader";
import { BrandSearchBar } from "@/components/brand/user/BrandSearchBar";
import { EmptyBrands } from "@/components/brand/user/EmptyBrands";
import { LoadingBrands } from "@/components/brand/user/LoadingBrands";
import { PaginationControls } from "@/components/PaginationControls";
import { useBrands, useSearchBrands } from "@/hooks/use-brand-hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemo, useState } from "react";

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const limit = 12;

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearchMode = debouncedSearch.trim().length > 0;

  // Fetch all brands (active only)
  const { data: brandsData, isLoading: isFetchingBrands } = useBrands(
    { isActive: true, page, limit, sort: sortBy },
    { isAdmin: false }
  );

  // Search brands
  const { data: searchData, isLoading: isSearching } = useSearchBrands(
    { q: debouncedSearch, page, limit, sort: sortBy },
    { isAdmin: false, enabled: isSearchMode }
  );

  const isLoading = isSearchMode ? isSearching : isFetchingBrands;

  // Get brands to display
  const displayBrands = useMemo(() => {
    if (isSearchMode) {
      return searchData?.data?.brands || [];
    }
    return brandsData?.data?.brands || [];
  }, [isSearchMode, searchData, brandsData]);

  const results = isSearchMode
    ? searchData?.results || 0
    : brandsData?.results || 0;

  const totalBrands = isSearchMode
    ? searchData?.total || 0
    : brandsData?.total || 0;

  const totalPages = Math.ceil(totalBrands / limit);
  const hasBrands = displayBrands.length > 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        {/* Header */}
        <BrandHeader />

        {/* Search Bar */}
        <BrandSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          isSearchMode={isSearchMode}
          debouncedSearch={debouncedSearch}
        />

        {/* Loading State */}
        {isLoading && <LoadingBrands />}

        {/* Content */}
        {!isLoading && (
          <>
            {!hasBrands ? (
              <EmptyBrands searchQuery={searchQuery} />
            ) : (
              <>
                <BrandGrid brands={displayBrands} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center px-4 sm:px-0 outline-2 outline-white pt-8">
                    <PaginationControls
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalResults={totalBrands}
                      resultsPerPage={results}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
