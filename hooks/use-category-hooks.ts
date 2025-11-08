// hooks/use-category-hooks.ts
import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/types/auth";
import {
  CategoriesParams,
  CategorySearchParams,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebounce } from "./use-debounce";
import { useMemo } from "react";

// Query Keys
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (params: CategoriesParams, isAdmin: boolean) => [
    ...CATEGORY_KEYS.lists(),
    { ...params, isAdmin },
  ],
  searches: () => [...CATEGORY_KEYS.all, "search"] as const,
  search: (params: CategorySearchParams, isAdmin: boolean) => [
    ...CATEGORY_KEYS.searches(),
    { ...params, isAdmin },
  ],
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useCategories(
  params: CategoriesParams = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.getAdminCategories(params)
        : apiClient.getCategories(params),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// --- HOOK FOR INFINITE LOADING ---
export function useInfiniteCategories(
  params: Omit<CategoriesParams, "page"> = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;

  return useInfiniteQuery({
    queryKey: [
      ...CATEGORY_KEYS.lists(),
      { ...params, isAdmin, infinite: true },
    ],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = { ...params, page: pageParam as number };
      return isAdmin
        ? apiClient.getAdminCategories(queryParams)
        : apiClient.getCategories(queryParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Calculate the total number of items fetched so far
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.results,
        0
      );
      // If the number of items we've fetched is less than the total available, there's a next page
      if (totalFetched < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined; // No more pages
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useSearchCategories(
  params: CategorySearchParams,
  options: { isAdmin?: boolean; enabled?: boolean } = {}
) {
  const { isAdmin = false, enabled = true } = options;

  return useQuery({
    queryKey: CATEGORY_KEYS.search(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.searchAdminCategories(params)
        : apiClient.searchCategories(params),
    enabled: enabled && !!params.q && params.q.trim().length > 0,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => apiClient.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// --- MUTATIONS ---

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category created successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryData;
    }) => apiClient.updateCategory(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(categoryId),
      });
      toast.success("Category updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => apiClient.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete category"),
  });
}

export function useToggleCategoryActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) =>
      apiClient.toggleCategoryActive(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category status toggled successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle category status"),
  });
}

/**
 * NEW HOOK: Combines infinite loading and search for categories in the admin context.
 * This hook consumes the existing hooks (useInfiniteCategories, useSearchCategories, useCategory)
 * to provide a simple interface for searchable select components.
 */
export const useSearchableInfiniteAdminCategories = (
  searchTerm: string,
  selectedId: string | null
) => {
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Use your existing hook for infinite loading in an admin context
  const {
    data: categoriesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteCategories({ limit: 20 }, { isAdmin: true });

  // Use your existing hook for searching in an admin context
  const { data: searchResults, isLoading: isSearching } = useSearchCategories(
    { q: debouncedSearch },
    { isAdmin: true, enabled: debouncedSearch.length > 0 }
  );

  // Use your existing hook to fetch the single selected item if its data is needed
  const { data: selectedCategoryData } = useCategory(selectedId || "");

  // Memoize the flattened list of all categories fetched via infinite scroll
  const allItems = useMemo(
    () => categoriesData?.pages.flatMap((page) => page.data.categories) ?? [],
    [categoriesData]
  );

  // This is the core logic that solves the display issue.
  // It constructs the final list of items to be displayed in the dropdown.
  const items = useMemo(() => {
    // 1. Determine the primary list to show (either search results or the paginated list)
    const primaryList =
      debouncedSearch && searchResults?.data.categories
        ? searchResults.data.categories
        : allItems;

    // 2. Check if the currently selected item is already present in that primary list.
    const isSelectedInPrimaryList = primaryList.some(
      (item) => item._id === selectedId
    );

    // 3. If a specific item is selected, but it's NOT in the current list
    //    (e.g., after a search is cleared), AND we have successfully fetched its data individually...
    if (
      selectedId &&
      !isSelectedInPrimaryList &&
      selectedCategoryData?.data?.category
    ) {
      // 4. ...then prepend it to the list. This is the key fix. It guarantees
      //    the SearchableSelect component can find the item's name to display it.
      return [selectedCategoryData.data.category, ...primaryList];
    }

    // 5. Otherwise, just return the primary list as is.
    return primaryList;
  }, [
    debouncedSearch,
    searchResults,
    allItems,
    selectedId,
    selectedCategoryData,
  ]);

  return {
    items,
    fetchNextPage,
    hasNextPage: hasNextPage && !debouncedSearch,
    isFetchingNextPage,
    isLoading: isInfiniteLoading || (debouncedSearch.length > 0 && isSearching),
  };
};
