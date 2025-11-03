// app/admin/categories/page.tsx
"use client";

import { useCategoryFilters } from "@/components/category/hooks/useCategoryFilters";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import {
  useCategories,
  useSearchCategories,
  useToggleCategoryActiveStatus,
} from "@/hooks/use-category-hooks";
import { useState } from "react";

import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryList } from "@/components/category/CategoryList";
import { CategoryModal } from "@/components/category/CategoryModal";
import { EmptyState } from "@/components/category/EmptyState";
import { ErrorState } from "@/components/category/ErrorState";
import { LoadingState } from "@/components/category/LoadingState";
import { PaginationControls } from "@/components/PaginationControls";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type ViewMode = "grid" | "list";

function CategoryManagementContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    page,
    searchQuery,
    sortOrder,
    statusFilter,
    isSearchMode,
    searchParams,
    queryParams,
    handlePageChange,
    setSearchQuery,
    handleSortChange,
    handleStatusChange,
  } = useCategoryFilters();

  // Use search hook when in search mode
  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSearchCategories(searchParams || { q: "" }, {
    isAdmin: true,
    enabled: isSearchMode,
  });

  // Use regular query when not searching
  const {
    data: categoriesResponse,
    isLoading: isFetching,
    error: fetchError,
  } = useCategories(queryParams, {
    isAdmin: true,
  });

  // Fetch all categories for parent dropdown (could be cached)
  const { data: allCategoriesData } = useCategories(
    { limit: 1000 },
    { isAdmin: true }
  );
  const allCategories = allCategoriesData?.data?.categories || [];

  const {
    isModalOpen,
    editingCategory,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isSubmitting,
  } = useCategoryModal();

  const toggleStatusMutation = useToggleCategoryActiveStatus();

  const handleToggleStatus = (categoryId: string) => {
    toggleStatusMutation.mutate(categoryId);
  };

  // Determine which data to use based on search mode
  const isLoading = isSearchMode ? isSearching : isFetching;
  const error = isSearchMode ? searchError : fetchError;
  const currentResponse = isSearchMode ? searchResponse : categoriesResponse;

  if (isLoading && !currentResponse) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const categories = currentResponse?.data?.categories || [];
  const results = currentResponse?.results || 0; // Items on current page
  const totalCategories = currentResponse?.total || 0; // Total items across all pages

  // Calculate total pages based on current mode's limit
  const currentLimit = isSearchMode
    ? searchParams?.limit || 12
    : queryParams.limit || 12;

  const effectiveTotal =
    isSearchMode && page === 1 && results < currentLimit
      ? results
      : totalCategories;

  const totalPages = Math.ceil(effectiveTotal / currentLimit);
  const hasCategories = categories.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <CategoryHeader />
        <CategoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortOrder={sortOrder}
          setSortOrder={handleSortChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          onAddCategory={() => handleOpenModal(null)}
          isSearchMode={isSearchMode}
        />

        {!hasCategories && !isLoading ? (
          <EmptyState
            searchQuery={searchQuery}
            onAddCategory={() => handleOpenModal(null)}
          />
        ) : viewMode === "grid" ? (
          <CategoryGrid
            categories={categories}
            allCategories={allCategories}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <CategoryList
            categories={categories}
            allCategories={allCategories}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Only show pagination if there are categories and more than 1 page */}
        {hasCategories && totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={effectiveTotal}
            resultsPerPage={currentLimit}
          />
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          categories={allCategories}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default function CategoryManagementPage() {
  return (
    <ProtectedRoute userType="admin">
      <CategoryManagementContent />
    </ProtectedRoute>
  );
}
