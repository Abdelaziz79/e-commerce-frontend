// hooks/use-brand-hooks.ts
import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/types/auth";
import {
  BrandSearchParams,
  BrandsParams,
  CreateBrandData,
  UpdateBrandData,
} from "@/types/brand";
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
export const BRAND_KEYS = {
  all: ["brands"] as const,
  lists: () => [...BRAND_KEYS.all, "list"] as const,
  list: (params: BrandsParams, isAdmin: boolean) => [
    ...BRAND_KEYS.lists(),
    { ...params, isAdmin },
  ],
  searches: () => [...BRAND_KEYS.all, "search"] as const,
  search: (params: BrandSearchParams, isAdmin: boolean) => [
    ...BRAND_KEYS.searches(),
    { ...params, isAdmin },
  ],
  details: () => [...BRAND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BRAND_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useBrands(
  params: BrandsParams = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;
  return useQuery({
    queryKey: BRAND_KEYS.list(params, isAdmin),
    queryFn: () =>
      isAdmin ? apiClient.getAdminBrands(params) : apiClient.getBrands(params),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// --- HOOK FOR INFINITE LOADING ---
export function useInfiniteBrands(
  params: Omit<BrandsParams, "page"> = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;

  return useInfiniteQuery({
    queryKey: [...BRAND_KEYS.lists(), { ...params, isAdmin, infinite: true }],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams = { ...params, page: pageParam as number };
      return isAdmin
        ? apiClient.getAdminBrands(queryParams)
        : apiClient.getBrands(queryParams);
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

export function useSearchBrands(
  params: BrandSearchParams,
  options: { isAdmin?: boolean; enabled?: boolean } = {}
) {
  const { isAdmin = false, enabled = true } = options;

  return useQuery({
    queryKey: BRAND_KEYS.search(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.searchAdminBrands(params)
        : apiClient.searchBrands(params),
    enabled: enabled && !!params.q && params.q.trim().length > 0,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: BRAND_KEYS.detail(id),
    queryFn: () => apiClient.getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// --- MUTATIONS ---

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandData) => apiClient.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand created successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create brand"),
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      brandId,
      data,
    }: {
      brandId: string;
      data: UpdateBrandData;
    }) => apiClient.updateBrand(brandId, data),
    onSuccess: (_, { brandId }) => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.detail(brandId) });
      toast.success("Brand updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update brand"),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: string) => apiClient.deleteBrand(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete brand"),
  });
}

export function useToggleBrandActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: string) => apiClient.toggleBrandActive(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand status toggled successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle brand status"),
  });
}

/**
 * NEW HOOK: Combines infinite loading and search for brands in the admin context.
 * This hook consumes the existing hooks (useInfiniteBrands, useSearchBrands, useBrand)
 * to provide a simple interface for searchable select components.
 */
export const useSearchableInfiniteAdminBrands = (
  searchTerm: string,
  selectedId: string | null
) => {
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Use your existing hook for infinite loading in an admin context
  const {
    data: brandsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteBrands({ limit: 20 }, { isAdmin: true });

  // Use your existing hook for searching in an admin context
  const { data: searchResults, isLoading: isSearching } = useSearchBrands(
    { q: debouncedSearch },
    { isAdmin: true, enabled: debouncedSearch.length > 0 }
  );

  // Use your existing hook to fetch the single selected item if its data is needed
  const { data: selectedBrandData } = useBrand(selectedId || "");

  // Memoize the flattened list of all brands fetched via infinite scroll
  const allItems = useMemo(
    () => brandsData?.pages.flatMap((page) => page.data.brands) ?? [],
    [brandsData]
  );

  // This is the core logic that solves the display issue.
  // It constructs the final list of items to be displayed in the dropdown.
  const items = useMemo(() => {
    // 1. Determine the primary list to show (either search results or the paginated list)
    const primaryList =
      debouncedSearch && searchResults?.data.brands
        ? searchResults.data.brands
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
      selectedBrandData?.data?.brand
    ) {
      // 4. ...then prepend it to the list. This is the key fix. It guarantees
      //    the SearchableSelect component can find the item's name to display it.
      return [selectedBrandData.data.brand, ...primaryList];
    }

    // 5. Otherwise, just return the primary list as is.
    return primaryList;
  }, [debouncedSearch, searchResults, allItems, selectedId, selectedBrandData]);

  return {
    items,
    fetchNextPage,
    hasNextPage: hasNextPage && !debouncedSearch,
    isFetchingNextPage,
    isLoading: isInfiniteLoading || (debouncedSearch.length > 0 && isSearching),
  };
};
