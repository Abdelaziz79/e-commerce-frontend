import { cn, getImageSrc } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        "group relative overflow-hidden bg-neutral-50/50",
        view === "grid" ? "aspect-square w-full" : "aspect-square w-full"
      )}
    >
      <Link href={`/products/${slug}`} className="block relative w-full h-full">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-neutral-300" />
          </div>
        ) : (
          <Image
            src={getImageSrc(currentImage)}
            alt={productName}
            fill
            sizes={sizes}
            className={cn(
              "object-contain mix-blend-multiply",
              view === "grid" ? "p-8" : "p-4"
            )}
            onError={onImageError}
            priority={view === "grid"}
          />
        )}
      </Link>

      {/* Single minimal badge for the most important info */}
      <div
        className={cn(
          "absolute z-10",
          view === "grid" ? "top-3 left-3" : "top-2 left-2"
        )}
      >
        {discountPercentage > 0 ? (
          <div
            className={cn(
              "inline-flex items-center justify-center min-w-[2rem] h-8 px-2.5 bg-white text-neutral-900 font-semibold text-xs rounded-full shadow-sm"
            )}
          >
            -{discountPercentage}%
          </div>
        ) : isNewProduct ? (
          <div className="inline-flex items-center justify-center h-8 px-2.5 bg-white text-neutral-900 font-semibold text-xs rounded-full shadow-sm">
            New
          </div>
        ) : featured && view === "grid" ? (
          <div className="inline-flex items-center justify-center h-8 px-2.5 bg-white text-neutral-900 font-semibold text-xs rounded-full shadow-sm">
            Featured
          </div>
        ) : null}
      </div>
    </div>
  );
}
