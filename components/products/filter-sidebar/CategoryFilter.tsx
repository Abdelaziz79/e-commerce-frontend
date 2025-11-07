"use client";

import { useDebounce } from "@/hooks/use-debounce";
import {
  useInfiniteCategories,
  useSearchCategories,
  useCategory,
} from "@/hooks/use-category-hooks";
import { Category } from "@/types/category";
import { useMemo, useState } from "react";
import { FilterableList } from "./FilterableList";

interface CategoryFilterProps {
  selectedCategory: string | null;
  toggleCategory: (categoryId: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  toggleCategory,
}: CategoryFilterProps) {
  const [categorySearch, setCategorySearch] = useState("");
  const debouncedCategorySearch = useDebounce(categorySearch, 300);

  const {
    data: categoriesData,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasNextCategoriesPage,
    isFetchingNextPage: isFetchingNextCategories,
    isLoading: isCategoriesLoading,
  } = useInfiniteCategories({ limit: 20 });

  const { data: categorySearchResults, isLoading: isCategorySearching } =
    useSearchCategories(
      { q: debouncedCategorySearch },
      { enabled: debouncedCategorySearch.length > 0 }
    );

  const allCategories = useMemo(
    () => categoriesData?.pages.flatMap((page) => page.data.categories) ?? [],
    [categoriesData]
  );

  // Check if selected category is in the current list
  const isSelectedInList = useMemo(() => {
    if (!selectedCategory) return true;
    return allCategories.some((cat) => cat._id === selectedCategory);
  }, [selectedCategory, allCategories]);

  // Fetch the selected category if it's not in the paginated list and not searching
  const { data: selectedCategoryData } = useCategory(selectedCategory || "");

  const displayCategories = useMemo(() => {
    let categories: Category[];

    if (debouncedCategorySearch && categorySearchResults?.data.categories) {
      // Show search results
      categories = categorySearchResults.data.categories;
    } else {
      // Show paginated results
      categories = [...allCategories];

      // If there's a selected category not in the list, add it to the top
      if (
        selectedCategory &&
        !isSelectedInList &&
        selectedCategoryData?.data?.category
      ) {
        categories = [selectedCategoryData.data.category, ...categories];
      }
    }

    return categories;
  }, [
    debouncedCategorySearch,
    categorySearchResults,
    allCategories,
    selectedCategory,
    isSelectedInList,
    selectedCategoryData,
  ]);

  return (
    <FilterableList<Category>
      items={displayCategories}
      selectedItem={selectedCategory}
      onSelectItem={toggleCategory}
      isLoading={isCategoriesLoading}
      isSearching={isCategorySearching}
      searchValue={categorySearch}
      onSearchChange={setCategorySearch}
      hasNextPage={hasNextCategoriesPage && !debouncedCategorySearch}
      fetchNextPage={fetchNextCategories}
      isFetchingNextPage={isFetchingNextCategories}
      searchPlaceholder="Search categories..."
      noItemsText="No categories available"
      noSearchResultsText="No categories found"
    />
  );
}
