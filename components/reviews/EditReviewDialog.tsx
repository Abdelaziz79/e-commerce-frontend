import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateReview } from "@/hooks/use-review-hooks";
import { getImageSrc } from "@/lib/utils";
import { Review, UpdateReviewData } from "@/types/review";
import { Loader2, Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface EditReviewDialogProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
}

export function EditReviewDialog({
  review,
  isOpen,
  onClose,
}: EditReviewDialogProps) {
  const [rating, setRating] = useState(review.rating);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(review.title || "");
  const [comment, setComment] = useState(review.comment);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateReviewMutation = useUpdateReview();

  useEffect(() => {
    if (isOpen) {
      setRating(review.rating);
      setTitle(review.title || "");
      setComment(review.comment);
      setNewImages([]);
      setNewImagePreviews([]);
      setExistingImages(review.images || []);
    }
  }, [isOpen, review]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const previews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setNewImagePreviews((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    // This object now matches the updated UpdateReviewData type
    const updateData: UpdateReviewData = {
      rating,
      comment: comment.trim(),
      existingImages, // Sends the array of image URLs to keep
      ...(title.trim() && { title: title.trim() }),
      ...(newImages.length > 0 && { images: newImages }), // Sends new files for upload
    };

    updateReviewMutation.mutate(
      {
        reviewId: review._id,
        data: updateData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const totalImageCount = existingImages.length + newImagePreviews.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Review
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update your review for{" "}
            {typeof review.product === "string"
              ? "this product"
              : review.product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer transition-colors ${
                    (hoverRating || rating) >= star
                      ? "text-gray-900 fill-gray-900"
                      : "text-gray-300 hover:text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              {rating > 0 && (
                <span className="ml-2 text-xs text-gray-600 font-medium">
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                    ? "Good"
                    : rating === 3
                    ? "Average"
                    : rating === 2
                    ? "Poor"
                    : "Bad"}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              Title{" "}
              <span className="text-gray-400 text-xs font-normal">
                (Optional)
              </span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              maxLength={100}
              className="text-sm h-10"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="edit-comment" className="text-sm font-medium">
              Review <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="edit-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product"
              rows={4}
              minLength={10}
              className="text-sm resize-none"
            />
            <p className="text-xs text-gray-500">
              {comment.length}/10 characters minimum
            </p>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Photos{" "}
              <span className="text-gray-400 text-xs font-normal">
                (Optional)
              </span>
            </Label>

            {totalImageCount > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {existingImages.map((imageUrl, index) => (
                  <div
                    key={imageUrl}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={getImageSrc(imageUrl)}
                      alt={`Existing review image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                ))}
                {newImagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group"
                  >
                    <Image
                      src={preview}
                      alt={`New review image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalImageCount < 5 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="edit-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-20 border-dashed text-sm"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      Upload images (max 5MB each)
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </div>

          {/* Submit */}
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={updateReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={
                updateReviewMutation.isPending ||
                rating === 0 ||
                comment.trim().length < 10
              }
            >
              {updateReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
