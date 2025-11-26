// components/reviews/admin/ReviewsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewRow } from "./ReviewRow";

interface ReviewsTableProps {
  reviews: Review[];
  sort: string;
  onSortChange: (sort: string) => void;
  isLoading: boolean;
}

export function ReviewsTable({
  reviews,
  sort,
  onSortChange,
  isLoading,
}: ReviewsTableProps) {
  const handleSort = (field: string) => {
    const isCurrentlyAsc = sort === field;
    const isCurrentlyDesc = sort === `-${field}`;
    onSortChange(
      isCurrentlyDesc ? field : isCurrentlyAsc ? `-${field}` : field
    );
  };

  const SortableHeader = ({
    field,
    label,
    className,
  }: {
    field: string;
    label: string;
    className?: string;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className={cn(
        "h-8 px-2 -ml-2 text-xs font-medium text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {label}
      <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
    </Button>
  );

  return (
    <div className="rounded-none border border-border/60 bg-white/50 shadow-sm backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b border-border/60">
            <TableHead className="w-[280px] pl-6 py-4">
              <SortableHeader field="product" label="Product & User" />
            </TableHead>
            <TableHead className="min-w-[400px] py-4">
              <span className="px-2 text-xs font-medium text-muted-foreground">
                Review Details
              </span>
            </TableHead>
            <TableHead className="w-[120px] py-4">
              <SortableHeader field="rating" label="Rating" />
            </TableHead>
            <TableHead className="w-[150px] py-4">
              <SortableHeader field="createdAt" label="Date" />
            </TableHead>
            <TableHead className="w-[50px] py-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
          className={cn(isLoading && "opacity-50 pointer-events-none")}
        >
          {reviews.map((review) => (
            <ReviewRow key={review._id} review={review} />
          ))}
        </TableBody>
      </Table>

      {!isLoading && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-3 ring-1 ring-border/50">
            <Inbox className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h4 className="text-sm font-medium text-foreground">
            No reviews found
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
}
