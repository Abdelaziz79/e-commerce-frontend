// hooks/use-product-search.ts
/**
 * Debounced product search hook with history
 */

import { SearchProductsParams } from "@/types/product";
import { useCallback, useEffect, useState } from "react";
import { useSearchProducts } from "./use-product-queries";

interface UseProductSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  enableHistory?: boolean;
  maxHistoryItems?: number;
}

const SEARCH_HISTORY_KEY = "product_search_history";

export function useProductSearch(options: UseProductSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    enableHistory = true,
    maxHistoryItems = 10,
  } = options;

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    if (!enableHistory) return;
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        setSearchHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, [enableHistory]);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setPage(1); // Reset to first page on new search
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const params: SearchProductsParams = {
    q: debouncedQuery,
    page,
    limit: 20,
  };

  const searchQuery = useSearchProducts(
    params,
    debouncedQuery.length >= minQueryLength
  );

  // Save to history when search is successful
  const addToHistory = useCallback(
    (searchTerm: string) => {
      if (!enableHistory || !searchTerm.trim()) return;

      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item !== searchTerm);
        const newHistory = [searchTerm, ...filtered].slice(0, maxHistoryItems);

        try {
          localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        } catch (error) {
          console.error("Failed to save search history:", error);
        }

        return newHistory;
      });
    },
    [enableHistory, maxHistoryItems]
  );

  // Add to history when results are loaded
  useEffect(() => {
    if (searchQuery.isSuccess && debouncedQuery && searchQuery.data?.data) {
      addToHistory(debouncedQuery);
    }
  }, [searchQuery.isSuccess, debouncedQuery, searchQuery.data, addToHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear search history:", error);
    }
  }, []);

  const removeFromHistory = useCallback((term: string) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((item) => item !== term);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to update search history:", error);
      }
      return newHistory;
    });
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setQuery(searchTerm);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setPage(1);
  }, []);

  return {
    // Search state
    query,
    debouncedQuery,
    isSearching: query.length >= minQueryLength,
    canSearch: query.length >= minQueryLength,

    // Results
    results: searchQuery.data?.data || [],
    totalResults: searchQuery.data?.total || 0,
    page: searchQuery.data?.page || 1,
    pages: searchQuery.data?.pages || 0,

    // Loading & error states
    isLoading: searchQuery.isLoading,
    isFetching: searchQuery.isFetching,
    error: searchQuery.error,

    // History
    searchHistory,
    clearHistory,
    removeFromHistory,

    // Actions
    handleSearch,
    handlePageChange,
    clearSearch,
    refetch: searchQuery.refetch,
  };
}

// Simple version for autocomplete/suggestions
export function useProductAutocomplete(minQueryLength: number = 2) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200); // Faster debounce for autocomplete

    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useSearchProducts(
    { q: debouncedQuery, limit: 5 },
    debouncedQuery.length >= minQueryLength
  );

  return {
    query,
    setQuery,
    suggestions: searchQuery.data?.data || [],
    isLoading: searchQuery.isLoading,
    clearQuery: () => setQuery(""),
  };
}
