// app/admin/categories/page.tsx

"use client";

import { CategoryFilters } from "@/components/category/CategoryFilters";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { CategoryList } from "@/components/category/CategoryList";
import { CategoryModal } from "@/components/category/CategoryModal";
import { CategoryStats } from "@/components/category/CategoryStats";
import { EmptyState } from "@/components/category/EmptyState";
import { ErrorState } from "@/components/category/ErrorState";
import { useCategoryFilters } from "@/components/category/hooks/useCategoryFilters";
import { useCategoryModal } from "@/components/category/hooks/useCategoryModal";
import { LoadingState } from "@/components/category/LoadingState";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCategories } from "@/hooks/use-category-hooks";
import { useState } from "react";

type ViewMode = "grid" | "list";

function CategoryManagementContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { data: categoriesData, isLoading, error } = useCategories({});

  const categories = categoriesData?.data?.categories || [];

  const {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredCategories,
    stats,
  } = useCategoryFilters(categories);

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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <CategoryHeader />
        <CategoryStats stats={stats} />

        <CategoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddCategory={() => handleOpenModal(null)}
        />

        {filteredCategories.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            filterType={filterType}
            onAddCategory={() => handleOpenModal(null)}
          />
        ) : viewMode === "grid" ? (
          <CategoryGrid
            categories={filteredCategories}
            allCategories={categories}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ) : (
          <CategoryList
            categories={filteredCategories}
            allCategories={categories}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}

        <CategoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingCategory={editingCategory}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          categories={categories}
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
