// ===== app/admin/brands/page.tsx =====
"use client";

import { BrandFilters } from "@/components/brand/BrandFilters";
import { BrandGrid } from "@/components/brand/BrandGrid";
import { BrandHeader } from "@/components/brand/BrandHeader";
import { BrandList } from "@/components/brand/BrandList";
import { BrandModal } from "@/components/brand/BrandModal";
import { BrandStats } from "@/components/brand/BrandStats";
import { EmptyState } from "@/components/brand/EmptyState";
import { ErrorState } from "@/components/brand/ErrorState";
import { useBrandFilters } from "@/components/brand/hooks/useBrandFilters";
import { useBrandModal } from "@/components/brand/hooks/useBrandModal";
import { LoadingState } from "@/components/brand/LoadingState";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useBrands } from "@/hooks/use-brand-hooks";
import { useState } from "react";

type ViewMode = "grid" | "list";

function BrandManagementContent() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { data: brandsData, isLoading, error } = useBrands({});

  const brands = brandsData?.data?.brands || [];

  const { searchQuery, setSearchQuery, filteredBrands, stats } =
    useBrandFilters(brands);

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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <BrandHeader />
        <BrandStats stats={stats} />
        <BrandFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddBrand={() => handleOpenModal(null)}
        />

        {filteredBrands.length === 0 ? (
          <EmptyState
            searchQuery={searchQuery}
            onAddBrand={() => handleOpenModal(null)}
          />
        ) : viewMode === "grid" ? (
          <BrandGrid
            brands={filteredBrands}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        ) : (
          <BrandList
            brands={filteredBrands}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
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
