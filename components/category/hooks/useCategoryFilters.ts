// ===== hooks/useCategoryFilters.ts =====
import { useMemo, useState } from "react";
import type { Category } from "@/types/category";

type FilterType = "all" | "active" | "inactive" | "parent" | "child";

export function useCategoryFilters(categories: Category[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterType === "all" ||
        (filterType === "active" && cat.isActive) ||
        (filterType === "inactive" && !cat.isActive) ||
        (filterType === "parent" && !cat.parentCategory) ||
        (filterType === "child" && cat.parentCategory);

      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, filterType]);

  const stats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.isActive).length,
      inactive: categories.filter((c) => !c.isActive).length,
      parent: categories.filter((c) => !c.parentCategory).length,
      child: categories.filter((c) => c.parentCategory).length,
    };
  }, [categories]);

  return {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filteredCategories,
    stats,
  };
}
