// app/products/components/ProductCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const discount =
    product.onSale && product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;
  const displayPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;

  // Safely access the brand name from the populated object
  const brandName =
    typeof product.brand === "object" ? product.brand.name : "Unbranded";

  // Get the image source with proper handling
  const getImageSrc = (): string => {
    const imagePath = product.mainImage || product.images?.[0];

    if (!imagePath) {
      return "/images/sample.jpg";
    }

    // If it's already a full URL (starts with http/https)
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // If it's a relative path from uploads (starts with /uploads/)
    if (imagePath.startsWith("/uploads/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // If it's just a filename or other relative path
    if (imagePath.startsWith("/")) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // Fallback
    return `${API_BASE_URL}/uploads/products/${imagePath}`;
  };

  const imageSrc = getImageSrc();

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-200 rounded-xl group">
        <div className="relative aspect-square bg-gray-50">
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <ImageIcon className="w-16 h-16 text-gray-300" />
            </div>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              {discount}% OFF
            </Badge>
          )}
          {product.isNewProduct && (
            <Badge className="absolute top-3 left-3 bg-blue-500 text-white hover:bg-blue-600">
              New
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-gray-500 mb-1">{brandName}</p>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-gray-900">
                  ${displayPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <span className="text-gray-400 text-sm line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-xs text-gray-500">
                  {product.rating.toFixed(1)} ({product.numReviews})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2">
          <Button
            variant="outline"
            className="w-full transition-colors border-gray-300 hover:bg-gray-800 hover:text-white rounded-md"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
