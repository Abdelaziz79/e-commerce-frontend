// app/admin/brands/page.tsx

"use client";

import { useBrandFilters } from "@/components/brand/hooks/useBrandFilters";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import {
  useBrands,
  useSearchBrands,
  useToggleBrandActiveStatus,
} from "@/hooks/use-brand-hooks";
import { useEffect } from "react";
import { toast } from "sonner";

import { BrandFilters } from "@/components/brand/BrandFilters";
import { BrandGrid } from "@/components/brand/BrandGrid";
import { BrandList } from "@/components/brand/BrandList";
import { BrandModal } from "@/components/brand/BrandModal";
import { EmptyState } from "@/components/brand/EmptyState";
import { ErrorState } from "@/components/brand/ErrorState";
import { LoadingState } from "@/components/brand/LoadingState";
import { PaginationControls } from "@/components/PaginationControls";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Plus } from "lucide-react";

function BrandManagementContent() {
  const {
    page,
    searchQuery,
    sortOrder,
    statusFilter,
    viewMode,
    setViewMode,
    isSearchMode,
    searchParams,
    queryParams,
    handlePageChange,
    setSearchQuery,
    handleSortChange,
    handleStatusChange,
  } = useBrandFilters();

  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchBrands(searchParams || { q: "" }, {
    isAdmin: true,
    enabled: isSearchMode,
  });

  const {
    data: brandsData,
    isLoading: isFetching,
    error: fetchError,
    refetch: refetchBrands,
  } = useBrands(queryParams, { isAdmin: true });

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

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.pointerEvents = "";
      document.body.style.removeProperty("pointer-events");
      const portalElements = document.querySelectorAll("[data-radix-portal]");
      portalElements.forEach((el) => {
        if (el.children.length === 0) el.remove();
      });
    }
  }, [isModalOpen]);

  const handleToggleStatus = (brandId: string) => {
    toggleStatusMutation.mutate(brandId);
  };

  const handleConfirmDelete = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast("Delete brand?", {
        description: "This action cannot be undone.",
        action: {
          label: "Delete",
          onClick: () => resolve(true),
        },
        cancel: {
          label: "Cancel",
          onClick: () => resolve(false),
        },
      });
    });

    if (confirmed) {
      handleDelete(id);
    }
  };

  const isLoading = isSearchMode ? isSearching : isFetching;
  const error = isSearchMode ? searchError : fetchError;
  const refetch = isSearchMode ? refetchSearch : refetchBrands;

  if (isLoading && !searchResponse && !brandsData) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const brands = isSearchMode
    ? searchResponse?.data?.brands || []
    : brandsData?.data?.brands || [];

  const results = isSearchMode
    ? searchResponse?.results || 0
    : brandsData?.results || 0;

  const totalBrands = isSearchMode
    ? searchResponse?.total || 0
    : brandsData?.total || 0;

  const currentLimit = isSearchMode
    ? searchParams?.limit || 16
    : queryParams.limit || 16;

  const effectiveTotal =
    isSearchMode && page === 1 && results < currentLimit
      ? results
      : totalBrands;

  const totalPages = Math.ceil(effectiveTotal / currentLimit);
  const hasBrands = brands.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <PageHeader
          pageTitle="Brands"
          pageDescription="Manage your product brands and manufacturers for better product organization"
          pageButtons={[
            {
              title: "Add Brand",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => handleOpenModal(null),
            },
          ]}
        />

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
            onDelete={handleConfirmDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <BrandList
            brands={brands}
            onEdit={handleOpenModal}
            onDelete={handleConfirmDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {hasBrands && totalPages > 1 && (
          <div className="pt-6">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalResults={effectiveTotal}
              resultsPerPage={currentLimit}
            />
          </div>
        )}

        {isModalOpen && (
          <BrandModal
            key={editingBrand?._id || "new"}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            editingBrand={editingBrand}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
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
