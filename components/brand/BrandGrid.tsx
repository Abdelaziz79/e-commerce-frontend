// components/brand/BrandGrid.tsx

import Image from "next/image";
import {
  Package,
  Pencil,
  Trash2,
  MoreVertical,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Brand } from "@/types/brand";
import { Badge } from "@/components/ui/badge";
import { getImageSrc } from "@/lib/utils";

interface BrandGridProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function BrandGrid({
  brands,
  onEdit,
  onDelete,
  onToggleStatus,
}: BrandGridProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (brands.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 font-medium">No brands found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {brands.map((brand) => {
        const imageUrl = brand?.logo ? getImageSrc(brand?.logo) : "";

        return (
          <Card
            key={brand?._id}
            className="group relative overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 rounded-xl hover:border-gray-300 p-0"
          >
            {/* Image Section */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={brand?.name}
                  fill
                  className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-14 w-14 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}

              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm transition-all ${
                  brand?.isActive
                    ? "bg-emerald-50/90 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20"
                    : "bg-gray-100/90 text-gray-600 border-gray-200 ring-1 ring-gray-900/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    brand?.isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {brand?.isActive ? "Active" : "Inactive"}
              </Badge>

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-white/95 hover:bg-white text-gray-700 shadow-lg rounded-lg backdrop-blur-sm"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-xl border border-gray-200 shadow-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => onEdit(brand)}
                        className="text-sm rounded-lg focus:bg-gray-50 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4 mr-2.5 text-gray-500" />
                        Edit Brand
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(brand?._id)}
                        className="text-sm rounded-lg focus:bg-gray-50 cursor-pointer"
                      >
                        {brand?.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2.5 text-gray-500" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2.5 text-gray-500" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-200" />
                      <DropdownMenuItem
                        onClick={() => onDelete(brand?._id)}
                        className="text-sm text-red-600 rounded-lg focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3 bg-white">
              <div className="space-y-1.5">
                <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
                  {brand?.name}
                </h3>
                {brand?.website && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={brand?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-700 underline"
                    >
                      Visit website
                    </a>
                  </p>
                )}
              </div>

              {brand?.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {brand?.description}
                </p>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(brand?.createdAt)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
