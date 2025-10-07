// src/components/products/product-page/ProductImageCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  return (
    <Carousel className="w-full group">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border">
              <Image
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                fill
                className="object-contain p-6"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <CarouselNext className="right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </Carousel>
  );
}
