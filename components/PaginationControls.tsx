// ===== components/PaginationControls.tsx =====
"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalResults?: number;
  resultsPerPage?: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  resultsPerPage,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the range of results being shown
  const startResult =
    totalResults && resultsPerPage
      ? (currentPage - 1) * resultsPerPage + 1
      : null;
  const endResult =
    totalResults && resultsPerPage
      ? Math.min(currentPage * resultsPerPage, totalResults)
      : null;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
      {/* Results info */}
      {totalResults && startResult && endResult && (
        <span className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {startResult} to {endResult} of {totalResults} results
        </span>
      )}

      {/* Pagination buttons */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
          aria-label="Go to first page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium text-muted-foreground min-w-[100px] text-center">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
          aria-label="Go to last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
