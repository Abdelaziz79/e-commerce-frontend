"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn, getImageSrc } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  price?: string;
  description?: string;
}

export function ProductImageCarousel({
  images,
  productName,
  price,
  description,
}: ProductImageCarouselProps) {
  const [imageErrors, setImageErrors] = useState<boolean[]>(() =>
    Array(images.length).fill(false)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  // This effect synchronizes the external state (selectedIndex) with the carousel's internal state.
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    // Initial sync
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // This effect ensures that if the selectedIndex is changed from outside the carousel (e.g., by clicking a thumbnail),
  // the carousel smoothly scrolls to that item.
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  // Use the carousel's built-in navigation methods for smooth, looped scrolling.
  const handlePrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <>
      <div className="space-y-3">
        {/* Main component carousel */}
        <div className="relative group">
          <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {images.map((image, index) => {
                const imageSrc = getImageSrc(image);
                const hasError = imageErrors[index];
                return (
                  <CarouselItem key={index}>
                    <div
                      className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-300 transition-all"
                      onClick={() => openModal(index)}
                    >
                      {hasError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                          <p className="mt-2 text-xs text-gray-400">No image</p>
                        </div>
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={`${productName} - Image ${index + 1}`}
                          fill
                          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
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
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        </div>

        {/* Image Counter and Dots - Below Carousel */}
        {images.length > 1 && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    selectedIndex === index
                      ? "w-6 bg-gray-900"
                      : "w-1.5 bg-gray-300 hover:bg-gray-400"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-gray-600 text-xs font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-none w-screen h-screen bg-white p-0 m-0 flex flex-col lg:flex-row">
          <VisuallyHidden>
            <DialogTitle>{productName} - Image Gallery</DialogTitle>
          </VisuallyHidden>

          {/* Main Image Viewer */}
          <div className="flex-1 relative flex items-center justify-center">
            {images.length > 1 && (
              <>
                <Button
                  onClick={handlePrevious}
                  size="icon"
                  variant="secondary"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full shadow-md z-10 bg-white hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleNext}
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-full shadow-md z-10 bg-white hover:bg-gray-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="relative w-full h-full p-6 sm:p-10 lg:p-16">
              {(() => {
                const imageSrc = getImageSrc(images[selectedIndex]);
                const hasError = imageErrors[selectedIndex];
                return hasError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="w-20 h-20 mb-3" />
                    <p className="text-sm">Image not available</p>
                  </div>
                ) : (
                  <Image
                    src={imageSrc}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1023px) 100vw, 60vw"
                    priority
                    onError={() => handleImageError(selectedIndex)}
                  />
                );
              })()}
            </div>
          </div>

          {/* Sidebar on Desktop / Bottom Panel on Mobile */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col flex-shrink-0 bg-white">
            <div className="p-5 sm:p-6 border-b border-gray-200">
              {price && (
                <p className="text-xl font-bold text-gray-900">{price}</p>
              )}
              <h2 className="text-lg font-semibold mt-1 text-gray-900">
                {productName}
              </h2>
              {description && (
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-4 lg:grid-cols-3 gap-2.5">
                {images.map((image, index) => {
                  const imageSrc = getImageSrc(image);
                  const hasError = imageErrors[index];
                  return (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={cn(
                        "relative aspect-square rounded-md overflow-hidden border bg-white transition-all",
                        selectedIndex === index
                          ? "border-gray-900  ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {hasError ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <ImageIcon className="w-5 h-5 text-gray-300" />
                        </div>
                      ) : (
                        <Image
                          src={imageSrc}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-contain p-1.5"
                          sizes="120px"
                          onError={() => handleImageError(index)}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
