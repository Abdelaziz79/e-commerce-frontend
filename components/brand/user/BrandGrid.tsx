// components/brand/user/BrandGrid.tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, ExternalLink } from "lucide-react";
import { getImageSrc } from "@/lib/utils";
import type { Brand } from "@/types/brand";

interface BrandGridProps {
  brands: Brand[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {brands.map((brand) => {
          const logoUrl = brand?.logo ? getImageSrc(brand.logo) : "";

          return (
            <Link
              key={brand._id}
              href={`/brands/${brand.slug}`}
              className="group block h-full"
            >
              <Card className="relative overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 rounded-xl hover:border-gray-300 p-0 h-full flex flex-col">
                {/* Logo Section - FIXED HEIGHT */}
                <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-8">
                  {logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={logoUrl}
                        alt={brand.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <Store className="h-14 w-14 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Website Badge */}
                  {brand.website && (
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm bg-white/90 text-gray-700 border-gray-200"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          brand.website,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </Badge>
                  )}
                </div>

                {/* Content Section - FLEX GROW */}
                <div className="p-4 flex flex-col flex-grow bg-white">
                  {/* Title - FIXED HEIGHT */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 min-h-[2.5rem]">
                      {brand.name}
                    </h3>
                  </div>

                  {/* Description - FIXED HEIGHT */}
                  <div className="mb-3 min-h-[2.75rem] flex-grow">
                    {brand.description ? (
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {brand.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Browse products from this brand
                      </p>
                    )}
                  </div>

                  {/* Footer - PUSHED TO BOTTOM */}
                  <div className="pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-500 font-medium group-hover:text-gray-900 transition-colors">
                      View Products →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
