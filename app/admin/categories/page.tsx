// app/admin/categories/page.tsx
"use client";

import { useCategoryFilters } from "@/components/category/hooks/useCategoryFilters";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import {
  useCategories,
  useSearchCategories,
  useToggleCategoryActiveStatus,
} from "@/hooks/use-category-hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { CategoryList } from "@/components/category/CategoryList";
import { CategoryModal } from "@/components/category/CategoryModal";
import { EmptyState } from "@/components/category/EmptyState";
import { ErrorState } from "@/components/category/ErrorState";
import { LoadingState } from "@/components/category/LoadingState";
import { PaginationControls } from "@/components/PaginationControls";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Plus } from "lucide-react";

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

  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchCategories(searchParams || { q: "" }, {
    isAdmin: true,
    enabled: isSearchMode,
  });

  const {
    data: categoriesData,
    isLoading: isFetching,
    error: fetchError,
    refetch: refetchCategories,
  } = useCategories(queryParams, { isAdmin: true });

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

  const handleToggleStatus = (categoryId: string) => {
    toggleStatusMutation.mutate(categoryId);
  };

  const handleConfirmDelete = async (id: string) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      toast("Delete category?", {
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
  const refetch = isSearchMode ? refetchSearch : refetchCategories;

  if (isLoading && !searchResponse && !categoriesData) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const categories = isSearchMode
    ? searchResponse?.data?.categories || []
    : categoriesData?.data?.categories || [];

  const results = isSearchMode
    ? searchResponse?.results || 0
    : categoriesData?.results || 0;

  const totalCategories = isSearchMode
    ? searchResponse?.total || 0
    : categoriesData?.total || 0;

  const currentLimit = isSearchMode
    ? searchParams?.limit || 16
    : queryParams.limit || 16;

  const effectiveTotal =
    isSearchMode && page === 1 && results < currentLimit
      ? results
      : totalCategories;

  const totalPages = Math.ceil(effectiveTotal / currentLimit);
  const hasCategories = categories.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <PageHeader
          pageTitle="Categories"
          pageDescription="Organize your products into categories and subcategories for better navigation"
          pageButtons={[
            {
              title: "Add Category",
              icon: <Plus className="h-4 w-4" />,
              onClick: () => handleOpenModal(null),
            },
          ]}
        />

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
            allCategories={categories}
            onEdit={handleOpenModal}
            onDelete={handleConfirmDelete}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <CategoryList
            categories={categories}
            allCategories={categories}
            onEdit={handleOpenModal}
            onDelete={handleConfirmDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {hasCategories && totalPages > 1 && (
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
          <CategoryModal
            key={editingCategory?._id || "new"}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            editingCategory={editingCategory}
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

export default function CategoryManagementPage() {
  return (
    <ProtectedRoute userType="admin">
      <CategoryManagementContent />
    </ProtectedRoute>
  );
}
