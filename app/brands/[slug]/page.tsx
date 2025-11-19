// app/brands/[slug]/page.tsx
"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBrand } from "@/hooks/use-brand-hooks";
import { useProducts } from "@/hooks/use-product-queries";
import { getImageSrc } from "@/lib/utils";
import {
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Loader2,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const brandSlug = params.slug as string;

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");

  // Fetch brand by slug (useBrand now handles both ID and slug)
  const {
    data: brandData,
    isLoading: isBrandsLoading,
    error: brandError,
  } = useBrand(brandSlug);

  const brand = brandData?.data?.brand;

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({
    brand: brand?._id,
    page,
    limit: 12,
    sort: sortBy,
  });

  const brandDetails = useMemo(() => {
    if (!brand) return null;

    return {
      logoUrl: getImageSrc(brand.logo),
    };
  }, [brand]);

  const handleResetFilters = () => {
    setPage(1);
    setSortBy("-createdAt");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isBrandsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-gray-900 rounded-full opacity-10 animate-ping" />
            <div className="relative bg-white p-4 rounded-full shadow-sm border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Loading brand...</p>
        </div>
      </div>
    );
  }

  if (brandError || !brand) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <Card className="p-12 text-center max-w-md border-0 bg-transparent">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-red-50">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Brand Not Found
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The brand you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/brands")}
              className="h-9 px-4 text-sm"
            >
              Browse Brands
            </Button>
            <Button
              onClick={handleRetry}
              className="bg-gray-900 hover:bg-gray-800 h-9 px-4 text-sm"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Logo */}
      <div className="relative bg-gray-900">
        {brandDetails?.logoUrl ? (
          <>
            {/* Background Logo */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={brandDetails.logoUrl}
                alt={brand.name}
                fill
                className="object-cover opacity-30"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/80" />
            </div>

            {/* Content */}
            <div className="relative">
              {/* Breadcrumb - Inside hero on dark background */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                <nav aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2 text-sm">
                    <li>
                      <Link
                        href="/"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                    <li>
                      <Link
                        href="/brands"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Brands
                      </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-white/50" />
                    <li className="text-white font-medium truncate max-w-[300px]">
                      {brand.name}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Hero Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Logo Card */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32  overflow-hidden  flex-shrink-0">
                    {brandDetails.logoUrl ? (
                      <Image
                        src={brandDetails.logoUrl}
                        alt={brand.name}
                        fill
                        className="object-contain p-3"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                      {brand.name}
                    </h1>
                    {brand.description && (
                      <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-4">
                        {brand.description}
                      </p>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* No Logo - Clean white header */}
            <div className="bg-white border-b">
              {/* Breadcrumb */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
                <nav aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2 text-sm">
                    <li>
                      <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Home
                      </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li>
                      <Link
                        href="/brands"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Brands
                      </Link>
                    </li>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li className="text-gray-900 font-medium truncate max-w-[300px]">
                      {brand.name}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Header Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Brand Icon Placeholder */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 shadow-sm flex-shrink-0 flex items-center justify-center">
                    <Store className="h-12 w-12 sm:h-16 sm:h-16 text-gray-300" />
                  </div>

                  {/* Brand Info */}
                  <div className="flex-1">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                      {brand.name}
                    </h1>
                    {brand.description && (
                      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed mb-4">
                        {brand.description}
                      </p>
                    )}
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Products Section */}
        <div className="py-8 border-t">
          <ProductGrid
            data={productsData}
            isLoading={isProductsLoading}
            error={productsError}
            page={page}
            setPage={setPage}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onRetry={handleRetry}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}
