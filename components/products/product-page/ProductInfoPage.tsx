// src/components/products/product-page/ProductInfoPage.tsx
"use client";

import { Accordion } from "@/components/ui/accordion";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { useState } from "react";
import { ImageModal } from "./ImageModal";
import { ProductDescriptionSection } from "./ProductDescriptionSection";
import { ProductRelatedProductsSection } from "./ProductRelatedProductsSection";
import { ProductShippingReturnsSection } from "./ProductShippingReturnsSection";
import { ProductSpecificationsSection } from "./ProductSpecificationsSection";
import { ProductReviewsSection } from "./reviews/ProductReviewsSection";

interface ProductInfoPageProps {
  product: Product;
  reviews: Review[];
  relatedProducts?: Product[];
}

export function ProductInfoPage({
  product,
  reviews,
  relatedProducts = [],
}: ProductInfoPageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const hasSpecifications =
    product.attributes && Object.keys(product.attributes).length > 0;
  const hasRelatedProducts = relatedProducts && relatedProducts.length > 0;
  // Determine default open sections
  const defaultSections = [
    "description",
    hasSpecifications && "specifications",
    "reviews",
    hasRelatedProducts && "related-products",
    "shipping-returns",
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="mx-auto">
        <Accordion
          type="multiple"
          defaultValue={defaultSections}
          className="space-y-3"
        >
          <ProductDescriptionSection
            description={product.description}
            richDescription={product.richDescription}
          />

          {hasSpecifications && (
            <ProductSpecificationsSection attributes={product.attributes} />
          )}

          {hasRelatedProducts && (
            <ProductRelatedProductsSection relatedProducts={relatedProducts} />
          )}

          <ProductReviewsSection
            reviews={reviews}
            productId={product._id}
            onImageClick={setSelectedImage}
          />

          <ProductShippingReturnsSection warranty={product.warranty} />
        </Accordion>
      </div>

      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
