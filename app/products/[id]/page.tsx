"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  useAddToCart,
  useAddToFavorites,
  useIsFavorite,
} from "@/hooks/use-cart-favorites";
import { useProduct } from "@/hooks/use-product-queries";
import { useReviews } from "@/hooks/use-review-hooks";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import AdminProductActions from "@/components/products/AdminProductActions";
import { ProductActions } from "@/components/products/product-page/ProductActions";
import { ProductBreadcrumb } from "@/components/products/product-page/ProductBreadcrumb";
import { ProductDetails } from "@/components/products/product-page/ProductDetails";
import { ProductImageCarousel } from "@/components/products/product-page/ProductImageCarousel";
import { ProductInfoPage } from "@/components/products/product-page/ProductInfoPage";
import { ProductMetaInfo } from "@/components/products/product-page/ProductMetaInfo";
import { ProductVariations } from "@/components/products/product-page/ProductVariations";
import { useAuth } from "@/hooks/auth-context";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productIdOrSlug = params.id as string;
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(
    null
  );

  const { data: productData, isLoading, error } = useProduct(productIdOrSlug);
  const product = productData?.data;

  const { data: reviewsData } = useReviews({ product: product?._id });
  const reviews = reviewsData?.data.reviews || [];

  const isFavorite = useIsFavorite(product?._id || "");

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { mutate: addToFavorites, isPending: isAddingToFavorites } =
    useAddToFavorites();

  // Filter out invalid related products (strings instead of objects)
  const relatedProducts = useMemo(() => {
    if (!product?.relatedProducts) return [];

    return product.relatedProducts.filter(
      (rp): rp is Product =>
        typeof rp === "object" && rp !== null && "_id" in rp
    );
  }, [product?.relatedProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/products")}>
          Back to Products
        </Button>
      </div>
    );
  }

  const selectedVariation = product.variations?.find(
    (v) => v._id === selectedVariationId
  );
  const currentPrice =
    selectedVariation?.price ??
    (product.onSale && product.salePrice ? product.salePrice : product.price);
  const originalPrice = selectedVariation
    ? undefined
    : product.onSale && product.salePrice
    ? product.price
    : undefined;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const availableStock =
    selectedVariation?.countInStock ?? product.countInStock;
  const category = product.category as Category;
  const brandName =
    typeof product.brand === "object" ? product.brand.name : "Unbranded";

  const handleAddToCart = () => {
    if (product.hasVariations && !selectedVariationId) {
      toast.error("Please select a product variation.");
      return;
    }

    addToCart({
      productId: product._id,
      quantity,
      variation: selectedVariation ? { sku: selectedVariation.sku } : undefined,
    });
  };

  const handleAddToFavorites = () => {
    addToFavorites(product._id);
  };

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <ProductBreadcrumb category={category} productName={product.name} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          <ProductImageCarousel
            images={product.images}
            productName={product.name}
          />

          <div className="space-y-6">
            <ProductDetails
              product={product}
              brandName={brandName}
              availableStock={availableStock}
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              discountPercent={discountPercent}
            />

            <ProductVariations
              variations={product.variations || []}
              selectedVariationId={selectedVariationId}
              onSelectVariation={setSelectedVariationId}
            />

            <ProductActions
              quantity={quantity}
              setQuantity={setQuantity}
              availableStock={availableStock}
              onAddToCart={handleAddToCart}
              onAddToFavorites={handleAddToFavorites}
              isAddingToCart={isAddingToCart}
              isAddingToFavorites={isAddingToFavorites}
              isFavorite={isFavorite}
            />

            <Separator />

            <ProductMetaInfo product={product} />
          </div>
        </div>

        <ProductInfoPage
          product={product}
          reviews={reviews}
          relatedProducts={relatedProducts}
        />
        {user?.role === "admin" && (
          <AdminProductActions productId={product._id} product={product} />
        )}
      </div>
    </div>
  );
}
