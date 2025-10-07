// ===== components/brand/hooks/useBrandFilters.ts =====
import { useMemo, useState } from "react";
import type { Brand } from "@/types/brand";

export function useBrandFilters(brands: Brand[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch =
        !searchQuery ||
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [brands, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: brands.length,
      withLogo: brands.filter((b) => b.logo).length,
      withWebsite: brands.filter((b) => b.website).length,
    };
  }, [brands]);

  return {
    searchQuery,
    setSearchQuery,
    filteredBrands,
    stats,
  };
}
