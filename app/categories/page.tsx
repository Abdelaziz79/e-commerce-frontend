// app/categories/page.tsx
"use client";

import { CategoryGrid } from "@/components/category/user/CategoryGrid";
import { CategoryHeader } from "@/components/category/user/CategoryHeader";
import { CategorySearchBar } from "@/components/category/user/CategorySearchBar";
import { EmptyCategories } from "@/components/category/user/EmptyCategories";
import { LoadingCategories } from "@/components/category/user/LoadingCategories";
import { PaginationControls } from "@/components/PaginationControls";
import { useCategories, useSearchCategories } from "@/hooks/use-category-hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { useMemo, useState } from "react";

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const limit = 12;

  const debouncedSearch = useDebounce(searchQuery, 400);
  const isSearchMode = debouncedSearch.trim().length > 0;

  // Fetch all categories (active only)
  const { data: categoriesData, isLoading: isFetchingCategories } =
    useCategories(
      { isActive: true, page, limit, sort: sortBy },
      { isAdmin: false }
    );

  // Search categories
  const { data: searchData, isLoading: isSearching } = useSearchCategories(
    { q: debouncedSearch, page, limit, sort: sortBy },
    { isAdmin: false, enabled: isSearchMode }
  );

  const isLoading = isSearchMode ? isSearching : isFetchingCategories;

  // Get categories to display
  const displayCategories = useMemo(() => {
    if (isSearchMode) {
      return searchData?.data?.categories || [];
    }
    return categoriesData?.data?.categories || [];
  }, [isSearchMode, searchData, categoriesData]);

  const results = isSearchMode
    ? searchData?.results || 0
    : categoriesData?.results || 0;

  const totalCategories = isSearchMode
    ? searchData?.total || 0
    : categoriesData?.total || 0;

  const totalPages = Math.ceil(totalCategories / limit);
  const hasCategories = displayCategories.length > 0;

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
        <CategoryHeader />

        {/* Search Bar */}
        <CategorySearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={handleSortChange}
          isSearchMode={isSearchMode}
          debouncedSearch={debouncedSearch}
        />

        {/* Loading State */}
        {isLoading && <LoadingCategories />}

        {/* Content */}
        {!isLoading && (
          <>
            {!hasCategories ? (
              <EmptyCategories searchQuery={searchQuery} />
            ) : (
              <>
                <CategoryGrid categories={displayCategories} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center px-4 sm:px-0 outline-2 outline-white pt-8">
                    <PaginationControls
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalResults={totalCategories}
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
