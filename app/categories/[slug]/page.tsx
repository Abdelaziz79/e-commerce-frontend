"use client";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCategory } from "@/hooks/use-category-hooks";
import { useProducts } from "@/hooks/use-product-queries";
import { getImageSrc } from "@/lib/utils";
import { Category } from "@/types/category";
import {
  AlertCircle,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug as string;

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-createdAt");

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useCategory(categorySlug);

  const category = categoryData?.data?.category;

  const {
    data: productsData,
    isLoading: isProductsLoading,
    error: productsError,
  } = useProducts({
    category: category?._id,
    page,
    limit: 12,
    sort: sortBy,
  });

  const categoryDetails = useMemo(() => {
    if (!category) return null;

    let parentName = null;
    let parentSlug = null;
    if (
      category.parentCategory &&
      typeof category.parentCategory === "object"
    ) {
      const parent = category.parentCategory as Category;
      parentName = parent.name;
      parentSlug = parent.slug;
    }

    return {
      imageUrl: getImageSrc(category.image),
      hasSubcategories:
        category.subcategories && category.subcategories.length > 0,
      parentCategoryName: parentName,
      parentCategorySlug: parentSlug,
    };
  }, [category]);

  const handleResetFilters = () => {
    setPage(1);
    setSortBy("-createdAt");
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isCategoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="relative mx-auto">
            <div className="absolute inset-0 bg-gray-900 rounded-full opacity-10 animate-ping" />
            <div className="relative bg-white p-4 rounded-full shadow-sm border border-gray-200">
              <Loader2 className="h-8 w-8 animate-spin text-gray-900" />
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Loading category...
          </p>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
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
              Category Not Found
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              The category you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/categories")}
              className="h-9 px-4 text-sm"
            >
              Browse Categories
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
      {/* Hero Section with Background Image */}
      <div className="relative bg-gray-900">
        {categoryDetails?.imageUrl ? (
          <>
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={categoryDetails.imageUrl}
                alt={category.name}
                fill
                className="object-cover opacity-40"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/70" />
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
                        href="/categories"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        Categories
                      </Link>
                    </li>
                    {categoryDetails?.parentCategoryName &&
                      categoryDetails?.parentCategorySlug && (
                        <>
                          <ChevronRight className="w-4 h-4 text-white/50" />
                          <li>
                            <Link
                              href={`/categories/${categoryDetails.parentCategorySlug}`}
                              className="text-white/70 hover:text-white transition-colors"
                            >
                              {categoryDetails.parentCategoryName}
                            </Link>
                          </li>
                        </>
                      )}
                    <ChevronRight className="w-4 h-4 text-white/50" />
                    <li className="text-white font-medium truncate max-w-[300px]">
                      {category.name}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Hero Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
                <div className="max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* No Image - Clean white header */}
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
                        href="/categories"
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Categories
                      </Link>
                    </li>
                    {categoryDetails?.parentCategoryName &&
                      categoryDetails?.parentCategorySlug && (
                        <>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <li>
                            <Link
                              href={`/categories/${categoryDetails.parentCategorySlug}`}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {categoryDetails.parentCategoryName}
                            </Link>
                          </li>
                        </>
                      )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <li className="text-gray-900 font-medium truncate max-w-[300px]">
                      {category.name}
                    </li>
                  </ol>
                </nav>
              </div>

              {/* Header Content */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subcategories */}
        {categoryDetails?.hasSubcategories && (
          <div className="py-8 sm:py-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Explore {category.name}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {category.subcategories!.map((subcat) => {
                const subcatImageUrl = getImageSrc(subcat.image);
                return (
                  <Link
                    key={subcat._id}
                    href={`/categories/${subcat.slug}`}
                    className="group"
                  >
                    <div className="relative">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 group-hover:shadow-lg transition-all duration-200">
                        {subcatImageUrl &&
                        subcatImageUrl !== "/placeholder.svg" ? (
                          <Image
                            src={subcatImageUrl}
                            alt={subcat.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 12vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 text-center line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {subcat.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

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
