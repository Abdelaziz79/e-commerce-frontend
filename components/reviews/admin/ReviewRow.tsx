// components/reviews/admin/ReviewRow.tsx
"use client";

import { ImageModal } from "@/components/shared/ImageModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getImageSrc } from "@/lib/utils";
import { Review } from "@/types/review";
import { CheckCircle2, Maximize2, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ReviewRowActions } from "./ReviewRowActions";

interface ReviewRowProps {
  review: Review;
}

export function ReviewRow({ review }: ReviewRowProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper for stars
  const renderRating = (rating: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-orange-400 text-orange-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );

  return (
    <TableRow className="group hover:bg-muted/20 border-b border-border/40 transition-all duration-200">
      {/* 1. PRODUCT & USER */}
      <TableCell className="align-top py-6 pl-6">
        <div className="flex flex-col gap-6">
          {/* Product */}
          <div className="flex gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
              <Image
                src={getImageSrc(review.product.images[0])}
                alt={review.product.name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <Link
                href={`/products/${review.product._id || review.product.id}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate max-w-[180px]"
              >
                {review.product.name}
              </Link>
              <span className="text-xs text-muted-foreground font-mono">
                ${review.product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
              <AvatarImage src={getImageSrc(review.user.avatar)} />
              <AvatarFallback className="text-xs bg-primary/5 text-primary font-medium">
                {review.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground/90 truncate max-w-[120px]">
                  {review.user.name}
                </span>
                {review.isVerifiedPurchase && (
                  <TooltipProvider>
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        Verified Purchase
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">
                Customer
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* 2. REVIEW CONTENT */}
      <TableCell className="align-top py-6">
        <div className="flex flex-col gap-2.5 max-w-[600px]">
          {review.title && (
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {review.title}
            </h3>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>

          {review.images && review.images.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1.5">
              {review.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(getImageSrc(img))}
                  className="group/img relative h-14 w-14 overflow-hidden rounded-md border border-border/60 bg-muted/30 hover:border-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <Image
                    src={getImageSrc(img)}
                    alt={`Attachment ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                    sizes="56px"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="h-4 w-4 text-white opacity-0 group-hover/img:opacity-100 transition-opacity scale-75 group-hover/img:scale-100 duration-200" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </TableCell>

      {/* 3. RATING */}
      <TableCell className="align-top py-6">
        <div className="flex flex-col gap-1">
          {renderRating(review.rating)}
          <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider ml-0.5">
            {review.rating > 4
              ? "Excellent"
              : review.rating > 2
              ? "Average"
              : "Poor"}
          </span>
        </div>
      </TableCell>

      {/* 4. DATE & META */}
      <TableCell className="align-top py-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(review.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>

          {review.helpfulVotes > 0 && (
            <Badge
              variant="secondary"
              className="w-fit px-1.5 py-0.5 h-auto text-[10px] gap-1 font-medium bg-muted text-muted-foreground hover:bg-muted"
            >
              <ThumbsUp className="h-2.5 w-2.5" />
              {review.helpfulVotes}
            </Badge>
          )}
        </div>
      </TableCell>

      {/* 5. ACTIONS */}
      <TableCell className="align-top py-6 text-right pr-6">
        <ReviewRowActions review={review} />
        {/* Modal is placed here to keep HTML valid (inside a cell), but renders to Portal */}
        <ImageModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </TableCell>
    </TableRow>
  );
}
