// components/reviews/admin/ReviewRowActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteReviewByAdmin } from "@/hooks/use-admin-mutations";
import { Review } from "@/types/review";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ReviewRowActionsProps {
  review: Review;
}

export function ReviewRowActions({ review }: ReviewRowActionsProps) {
  const deleteReviewMutation = useDeleteReviewByAdmin();

  const handleDelete = () => {
    toast("Delete this review?", {
      description: `This will permanently remove the review by ${review.user.name}. This action cannot be undone.`,
      action: {
        label: "Delete",
        onClick: () => deleteReviewMutation.mutate(review._id),
      },
      cancel: { label: "Cancel", onClick: () => toast.dismiss() },
      classNames: { actionButton: "bg-red-600 text-white" },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link
            href={`/products/${review.product._id}?review=${review._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Review
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleteReviewMutation.isPending}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
