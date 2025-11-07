import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, getImageSrc } from "@/lib/utils";

interface ProductImageProps {
  currentImage: string;
  productName: string;
  slug: string;
  imageError: boolean;
  onImageError: () => void;
  discountPercentage: number;
  isNewProduct?: boolean;
  featured?: boolean;
  sizes: string;
  view: "grid" | "list";
}

export function ProductImage({
  currentImage,
  productName,
  slug,
  imageError,
  onImageError,
  discountPercentage,
  isNewProduct,
  featured,
  sizes,
  view,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white",
        view === "grid" ? "aspect-square w-full" : "aspect-square w-full"
      )}
    >
      <Link href={`/products/${slug}`} className="block relative w-full h-full">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <ImageIcon className="h-16 w-16 text-gray-300" />
          </div>
        ) : (
          <Image
            src={getImageSrc(currentImage)}
            alt={productName}
            fill
            sizes={sizes}
            className={cn(
              "object-contain transition-transform duration-300 group-hover:scale-105",
              view === "grid" ? "p-4" : "p-3"
            )}
            onError={onImageError}
            priority={view === "grid"}
          />
        )}
      </Link>

      {/* Badges */}
      <div
        className={cn(
          "absolute flex z-10",
          view === "grid"
            ? "top-3 left-3 flex-col gap-2"
            : "top-2 left-2 flex-wrap gap-1.5 max-w-[calc(100%-1rem)]"
        )}
      >
        {discountPercentage > 0 && (
          <Badge
            className={cn(
              "bg-red-500 hover:bg-red-600 text-white border-0 font-medium",
              view === "grid" ? "px-2 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
            )}
          >
            -{discountPercentage}%
          </Badge>
        )}
        {isNewProduct && (
          <Badge
            className={cn(
              "bg-blue-500 hover:bg-blue-600 text-white border-0 font-medium",
              view === "grid" ? "px-2 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
            )}
          >
            NEW
          </Badge>
        )}
        {featured && view === "grid" && (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 font-medium px-2 py-0.5 text-xs">
            Featured
          </Badge>
        )}
      </div>
    </div>
  );
}
