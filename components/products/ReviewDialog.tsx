// app/products/components/ReviewDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/use-review-hooks";
import { CreateReviewData } from "@/types/review";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ReviewDialogProps {
  productId: string;
  children: React.ReactNode;
}

export function ReviewDialog({ productId, children }: ReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const createReviewMutation = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating by clicking a star.");
      return;
    }
    if (comment.trim().length < 10) {
      toast.error("Review comment must be at least 10 characters long.");
      return;
    }

    const reviewData: CreateReviewData = {
      product: productId,
      rating,
      title: title.trim(),
      comment: comment.trim(),
    };

    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        toast.success("Thank you! Your review has been submitted.");
        // Reset form and close dialog
        setIsOpen(false);
        setRating(0);
        setTitle("");
        setComment("");
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts with other customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-7 w-7 cursor-pointer transition-colors duration-150 ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Best purchase ever!"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or disliked about the product..."
              rows={5}
              minLength={10}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="w-full sm:w-auto"
            >
              {createReviewMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
