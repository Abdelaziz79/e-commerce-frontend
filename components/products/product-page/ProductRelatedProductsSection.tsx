// src/components/products/product-page/ProductRelatedProductsSection.tsx
"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "../ProductCard";
import { SectionContainer } from "./SectionContainer";
import { SectionHeader } from "./SectionHeader";

interface RelatedProductsSectionProps {
  relatedProducts: Product[];
}

export function ProductRelatedProductsSection({
  relatedProducts,
}: RelatedProductsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [relatedProducts]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <SectionContainer value="related-products">
      <SectionHeader
        icon={Grid3x3}
        title={
          <div className="flex items-center gap-2">
            <span>Related Products</span>
            <span className="text-xs font-normal text-gray-500">
              ({relatedProducts.length})
            </span>
          </div>
        }
      />
      <AccordionContent className="px-5 pb-5 pt-1">
        <div className="relative group">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white shadow-lg border-gray-200 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {/* Products Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-0">
              {relatedProducts.map((product, index) => {
                const isFirst = index === 0;
                const isLast = index === relatedProducts.length - 1;
                const position = isFirst ? "left" : isLast ? "right" : "middle";

                return (
                  <div
                    key={product._id}
                    className={cn(
                      "flex-shrink-0",
                      "w-[280px] sm:w-[320px]",
                      "animate-in fade-in slide-in-from-bottom-4"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <ProductCard
                      product={product}
                      view="grid"
                      position={position}
                      isLast={isLast}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* View All Link */}
        {/* {relatedProducts.length > 4 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              className="text-sm font-semibold hover:bg-gray-50"
            >
              View All Related Products
            </Button>
          </div>
        )} */}
      </AccordionContent>
    </SectionContainer>
  );
}
