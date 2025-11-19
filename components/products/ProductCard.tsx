"use client";

import { useAuth } from "@/hooks/auth-context";
import {
  useAddToCart,
  useIsFavorite,
  useToggleFavorite,
} from "@/hooks/use-cart-favorites";
import { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import { ProductCardGridView } from "./ProductCardGridView";
import { ProductCardListView } from "./ProductCardListView";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
  position?: "left" | "middle" | "right";
  isLast?: boolean;
}

export function ProductCard({
  product,
  view = "grid",
  position = "middle",
  isLast = false,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { token } = useAuth();

  const isFavorite = useIsFavorite(product._id);
  const { toggle: toggleFavorite, isLoading: isFavoriteLoading } =
    useToggleFavorite();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  // Only use additional images (not mainImage) for cycling
  const additionalImages = useMemo(
    () => product.images.filter(Boolean),
    [product.images]
  );

  const discountPercentage = useMemo(
    () =>
      product.onSale && product.salePrice
        ? Math.round(
            ((product.price - product.salePrice) / product.price) * 100
          )
        : 0,
    [product]
  );

  const displayPrice = useMemo(
    () =>
      product.onSale && product.salePrice ? product.salePrice : product.price,
    [product]
  );

  const brandName = useMemo(
    () => (typeof product.brand === "object" ? product.brand?.name : "Brand"),
    [product.brand]
  );

  const brandSlug = useMemo(
    () => (typeof product.brand === "object" ? product.brand?.slug : ""),
    [product.brand]
  );

  const categoryName = useMemo(
    () =>
      typeof product.category === "object"
        ? product.category?.name
        : "Category",
    [product.category]
  );

  const categorySlug = useMemo(
    () => (typeof product.category === "object" ? product.category?.slug : ""),
    [product.category]
  );

  // Cycle through additional images only, not main image
  useEffect(() => {
    if (!isHovered || additionalImages.length === 0) {
      setCurrentImageIndex(0);
      return;
    }

    // Immediately show first additional image on hover
    setCurrentImageIndex(1);

    if (additionalImages.length === 1) return;

    // Then cycle through remaining images every 1 second
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex > additionalImages.length ? 1 : nextIndex;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, additionalImages.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || product.countInStock === 0) return;
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        },
      }
    );
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (token) toggleFavorite(product._id, isFavorite);
  };

  // Get current image to display
  const getCurrentImage = () => {
    if (currentImageIndex === 0) {
      return product.mainImage;
    }
    return additionalImages[currentImageIndex - 1];
  };

  const sharedProps = {
    product,
    currentImage: getCurrentImage(),
    imageError,
    setImageError,
    isHovered,
    setIsHovered,
    brandName,
    brandSlug,
    categoryName,
    categorySlug,
    displayPrice,
    discountPercentage,
    isFavorite,
    isFavoriteLoading,
    isAddingToCart,
    showSuccess,
    token,
    handleFavoriteClick,
    handleAddToCart,
    position,
    isLast,
  };

  if (view === "list") {
    return <ProductCardListView {...sharedProps} />;
  }

  return <ProductCardGridView {...sharedProps} />;
}
