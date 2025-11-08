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
import {
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIconLucide,
} from "lucide-react";
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

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

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

  const handlePrevious = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Carousel */}
        <div className="relative group">
          <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {images.map((image, index) => {
                const imageSrc = getImageSrc(image);
                const hasError = imageErrors[index];
                return (
                  <CarouselItem key={index}>
                    <div
                      className="relative aspect-square bg-white rounded-lg overflow-hidden  cursor-pointer transition-all hover:shadow-md"
                      onClick={() => openModal(index)}
                    >
                      {hasError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center ">
                          <ImageIconLucide className="w-10 h-10 text-gray-300" />
                          <p className="mt-2 text-xs font-medium text-gray-400">
                            No image
                          </p>
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
                <CarouselPrevious className="left-3 h-9 w-9 border-gray-200 bg-white hover:bg-gray-50 text-gray-700" />
                <CarouselNext className="right-3 h-9 w-9 border-gray-200 bg-white hover:bg-gray-50 text-gray-700" />
              </>
            )}
          </Carousel>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => {
              const imageSrc = getImageSrc(image);
              const hasError = imageErrors[index];
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border transition-all",
                    isSelected
                      ? "border-gray-900 "
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {hasError ? (
                    <div className="w-full h-full flex items-center justify-center ">
                      <ImageIconLucide className="w-4 h-4 text-gray-300" />
                    </div>
                  ) : (
                    <Image
                      src={imageSrc}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain p-1.5 bg-white"
                      sizes="100px"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!max-w-none w-screen h-screen bg-white p-0 m-0 flex flex-col lg:flex-row">
          <VisuallyHidden>
            <DialogTitle>{productName} - Image Gallery</DialogTitle>
          </VisuallyHidden>

          {/* Close Button */}
          <Button
            onClick={() => setIsModalOpen(false)}
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 z-50 h-9 w-9 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-gray-100 border border-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Main Image Viewer */}
          <div className="flex-1 relative flex items-center justify-center ">
            {images.length > 1 && (
              <>
                <Button
                  onClick={handlePrevious}
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-lg shadow-md z-10 bg-white hover:bg-gray-50 border border-gray-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleNext}
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 rounded-lg shadow-md z-10 bg-white hover:bg-gray-50 border border-gray-200"
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
                    <ImageIconLucide className="w-20 h-20 mb-3" />
                    <p className="text-sm font-medium">Image not available</p>
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

            {/* Image Counter - Overlay on main image */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-xs font-semibold text-gray-900">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop / Bottom Panel - Mobile */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col flex-shrink-0 bg-white">
            {/* Product Info */}
            <div className="p-5 sm:p-6 border-b border-gray-200 space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {productName}
              </h2>
              {price && (
                <p className="text-xl font-bold text-gray-900">{price}</p>
              )}
              {description && (
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            {/* Thumbnail Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="grid grid-cols-4 lg:grid-cols-3 gap-2.5">
                {images.map((image, index) => {
                  const imageSrc = getImageSrc(image);
                  const hasError = imageErrors[index];
                  const isSelected = selectedIndex === index;

                  return (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border bg-white transition-all",
                        isSelected
                          ? "border-gray-900"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {hasError ? (
                        <div className="w-full h-full flex items-center justify-center ">
                          <ImageIconLucide className="w-5 h-5 text-gray-300" />
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
