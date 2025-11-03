// ===== app/admin/brands/page.tsx =====
"use client";

import { useBrandFilters } from "@/components/brand/hooks/useBrandFilters";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import {
  useBrands,
  useSearchBrands,
  useToggleBrandActiveStatus,
} from "@/hooks/use-brand-hooks";
import { useState } from "react";

import { BrandFilters } from "@/components/brand/BrandFilters";
import { BrandGrid } from "@/components/brand/BrandGrid";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandList } from "@/components/brand/BrandList";
import { BrandModal } from "@/components/brand/BrandModal";
import { EmptyState } from "@/components/brand/EmptyState";
import { ErrorState } from "@/components/brand/ErrorState";
import { LoadingState } from "@/components/brand/LoadingState";
import { PaginationControls } from "@/components/PaginationControls";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type ViewMode = "grid" | "list";

function BrandManagementContent() {
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
  } = useBrandFilters();

  // Use search hook when in search mode
  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSearchBrands(searchParams || { q: "" }, {
    isAdmin: true,
    enabled: isSearchMode,
  });

  // Use regular query when not searching
  const {
    data: brandsResponse,
    isLoading: isFetching,
    error: fetchError,
  } = useBrands(queryParams, {
    isAdmin: true,
  });

  const {
    isModalOpen,
    editingBrand,
    formData,
    setFormData,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isSubmitting,
  } = useBrandModal();

  const toggleStatusMutation = useToggleBrandActiveStatus();

  const handleToggleStatus = (brandId: string) => {
    toggleStatusMutation.mutate(brandId);
  };

  // Determine which data to use based on search mode
  const isLoading = isSearchMode ? isSearching : isFetching;
  const error = isSearchMode ? searchError : fetchError;
  const currentResponse = isSearchMode ? searchResponse : brandsResponse;

  if (isLoading && !currentResponse) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const brands = currentResponse?.data?.brands || [];
  const results = currentResponse?.results || 0; // Items on current page
  const totalBrands = currentResponse?.total || 0; // Total items across all pages

  // Calculate total pages based on current mode's limit
  const currentLimit = isSearchMode
    ? searchParams?.limit || 12
    : queryParams.limit || 12;

  // WORKAROUND: If in search mode and results is less than limit and we're on page 1,
  // it means this is the only page, so use results as total
  const effectiveTotal =
    isSearchMode && page === 1 && results < currentLimit
      ? results
      : totalBrands;

  const totalPages = Math.ceil(effectiveTotal / currentLimit);
  const hasBrands = brands.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <BrandHeader />
        <BrandFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortOrder={sortOrder}
          setSortOrder={handleSortChange}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusChange}
          onAddBrand={() => handleOpenModal(null)}
          isSearchMode={isSearchMode}
        />

        {!hasBrands && !isLoading ? (
          <EmptyState
            searchQuery={searchQuery}
            onAddBrand={() => handleOpenModal(null)}
          />
        ) : viewMode === "grid" ? (
          <BrandGrid
            brands={brands}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <BrandList
            brands={brands}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Only show pagination if there are brands and more than 1 page */}
        {hasBrands && totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalResults={effectiveTotal}
            resultsPerPage={currentLimit}
          />
        )}

        <BrandModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingBrand={editingBrand}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default function BrandManagementPage() {
  return (
    <ProtectedRoute userType="admin">
      <BrandManagementContent />
    </ProtectedRoute>
  );
}
