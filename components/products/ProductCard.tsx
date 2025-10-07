// app/products/components/ProductCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.onSale && product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;
  const displayPrice =
    product.onSale && product.salePrice ? product.salePrice : product.price;

  // Safely access the brand name from the populated object
  const brandName =
    typeof product.brand === "object" ? product.brand.name : "Unbranded";

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-gray-200 rounded-xl group">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={
              product.mainImage || product.images?.[0] || "/images/sample.jpg"
            }
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
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
                {/* ... star SVG icon */}
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
