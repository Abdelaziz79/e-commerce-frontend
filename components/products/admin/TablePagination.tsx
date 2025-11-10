// components/products/admin/TablePagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  pagination: {
    page: number;
    pages: number;
    total: number;
    results: number;
  };
  onPageChange: (page: number) => void;
}

export function TablePagination({
  pagination,
  onPageChange,
}: TablePaginationProps) {
  const { page, pages, total, results } = pagination;
  const from = (page - 1) * results + 1;
  const to = Math.min(page * results, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-none">
      <div className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {from}-{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">
          {total.toLocaleString()}
        </span>{" "}
        products
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-9 px-3 text-sm border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <span className="text-sm font-medium text-gray-700 px-3">
          Page {page} of {pages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="h-9 px-3 text-sm border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
