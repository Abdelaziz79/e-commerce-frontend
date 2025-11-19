"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchProducts } from "@/hooks/use-product-queries";
import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface GlobalSearchProps {
  className?: string;
  placeholder?: string;
  onSearchSubmit?: () => void; // Callback to close mobile sheet
}

export function GlobalSearch({
  className,
  placeholder = "Search products...",
  onSearchSubmit,
}: GlobalSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Debounce for API calls
  const debouncedQuery = useDebounce(query, 300);

  // Sync with URL on load
  useEffect(() => {
    setQuery(searchParams.get("keyword") || "");
  }, [searchParams]);

  // Fetch suggestions
  const { data: suggestions, isLoading } = useSearchProducts(
    { q: debouncedQuery, limit: 10 },
    isOpen && debouncedQuery.length > 1
  );

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length > 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`); // Changed from 'keyword' to 'search' to match your API
      setIsOpen(false);
      onSearchSubmit?.();
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsOpen(false);
    onSearchSubmit?.();
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full pl-10 h-10 bg-secondary/30 border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all rounded-full"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && query.length > 1 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <ScrollArea className="max-h-[320px]">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="py-2">
                {/* "Search for..." option */}
                <button
                  onClick={() => handleSearch()}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-primary hover:bg-primary/5 flex items-center gap-2 transition-colors"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search for &quot;{query}&quot;</span>
                </button>

                {suggestions?.data && suggestions.data.length > 0 && (
                  <div className="h-px bg-gray-100 mx-4 my-1" />
                )}

                {/* Product Suggestions */}
                {suggestions?.data?.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-4 transition-colors group"
                  >
                    <div className="relative h-10 w-10 bg-gray-100 rounded-md border border-gray-200 flex-shrink-0 overflow-hidden">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-contain p-1 mix-blend-multiply group-hover:scale-105 transition-transform"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.brand &&
                          typeof product.brand === "object" &&
                          "name" in product.brand && (
                            <span className="text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                              {product.brand.name}
                            </span>
                          )}
                      </div>
                    </div>
                  </button>
                ))}

                {/* Empty State */}
                {suggestions?.data.length === 0 && !isLoading && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No products found for &quot;{query}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
