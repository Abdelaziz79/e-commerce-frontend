// components/favorites/FavoritesPage.tsx
"use client";

import { useFavorites } from "@/hooks/use-cart-favorites";
import { useState } from "react";
import { LoadingDisplay } from "./LoadingDisplay";
import { ErrorDisplay } from "./ErrorDisplay";
import { EmptyFavorites } from "./EmptyFavorites";
import { FavoritesView } from "./FavoritesView";

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-createdAt");
  const limit = 12;

  const { data, isLoading, error } = useFavorites({ page, limit, sort });

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return (
      <ErrorDisplay message="Failed to load favorites. Please try again." />
    );
  }

  const favorites = data?.data?.favorites || [];
  const totalPages = data?.pages || 1;
  const totalItems = data?.total || 0;

  if (favorites.length === 0 && page === 1) {
    return <EmptyFavorites />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FavoritesView
        favorites={favorites}
        totalPages={totalPages}
        totalItems={totalItems}
        currentPage={page}
        onPageChange={setPage}
        currentSort={sort}
        onSortChange={setSort}
      />
    </div>
  );
}
