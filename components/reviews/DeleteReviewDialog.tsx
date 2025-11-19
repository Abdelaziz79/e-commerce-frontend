import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteReview } from "@/hooks/use-review-hooks";
import { Review } from "@/types/review";
import { AlertCircle, Loader2 } from "lucide-react";

interface DeleteReviewDialogProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteReviewDialog({
  review,
  isOpen,
  onClose,
}: DeleteReviewDialogProps) {
  const deleteReviewMutation = useDeleteReview();

  const handleDelete = () => {
    deleteReviewMutation.mutate(review._id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const productName =
    typeof review.product === "string" ? "this product" : review.product?.name;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-base font-semibold text-gray-900 mb-1">
                Delete Review
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Are you sure you want to delete your review for &quot;
                {productName}&quot;? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={deleteReviewMutation.isPending}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteReviewMutation.isPending}
            size="sm"
          >
            {deleteReviewMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
