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
import { Loader2, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createReviewMutation = useCreateReview();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      // Limit file size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setComment("");
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      comment: comment.trim(),
      ...(title.trim() && { title: title.trim() }),
      ...(images.length > 0 && { images }),
    };

    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        toast.success("Thank you! Your review has been submitted.");
        setIsOpen(false);
        resetForm();
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience to help others make informed decisions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Rating Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Rate this product <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-all duration-200 ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400 fill-yellow-400 scale-110"
                      : "text-gray-300 hover:text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {rating === 5
                    ? "Excellent!"
                    : rating === 4
                    ? "Good"
                    : rating === 3
                    ? "Average"
                    : rating === 2
                    ? "Poor"
                    : "Terrible"}
                </span>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Review Title{" "}
              <span className="text-gray-500 text-sm font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a few words"
              maxLength={100}
              className="text-base"
            />
            <p className="text-xs text-gray-500">
              {title.length}/100 characters
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-semibold">
              Your Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience with this product. What did you like or dislike? How would you use it?"
              rows={6}
              minLength={10}
              required
              className="text-base resize-none"
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters ({comment.length} characters)
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Add Photos{" "}
              <span className="text-gray-500 text-sm font-normal">
                (Optional, max 5)
              </span>
            </Label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 20vw"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 z-10 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {images.length < 5 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-dashed border-2 h-24 hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG up to 5MB each
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              disabled={createReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createReviewMutation.isPending ||
                rating === 0 ||
                comment.trim().length < 10
              }
              className="min-w-[120px]"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
