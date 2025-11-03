// src/components/products/product-page/ProductImageCarousel.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Define the base URL for backend images, with a fallback for development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  // State to track loading errors for each image
  const [imageErrors, setImageErrors] = useState<boolean[]>(() =>
    Array(images.length).fill(false)
  );

  /**
   * Resolves the final image URL.
   * Handles both absolute URLs and relative paths from the backend.
   * @param imagePath The original image path string.
   * @returns The full, accessible URL for the image.
   */
  const resolveImageUrl = (imagePath: string): string => {
    if (!imagePath) {
      // You can return a default placeholder image path if needed
      return "/images/placeholder.png";
    }

    // If it's already a full URL, return it as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // If it's a relative path, prepend the API base URL
    // This handles paths like "/uploads/products/image.jpg"
    if (imagePath.startsWith("/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // Fallback for other cases (e.g., just a filename)
    return `${API_BASE_URL}/uploads/products/${imagePath}`;
  };

  // Handler to set the error state for a specific image index
  const handleImageError = (index: number) => {
    setImageErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = true;
      return newErrors;
    });
  };

  return (
    <Carousel className="w-full group">
      <CarouselContent>
        {images.map((image, index) => {
          const imageSrc = resolveImageUrl(image);
          const hasError = imageErrors[index];

          return (
            <CarouselItem key={index}>
              <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border">
                {hasError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-20 h-20 text-gray-300" />
                  </div>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={`${productName} - Image ${index + 1}`}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}
