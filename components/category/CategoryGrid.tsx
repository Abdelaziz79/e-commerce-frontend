// components/category/CategoryGrid.tsx
import Image from "next/image";
import {
  ImageIcon,
  Pencil,
  Trash2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";
import { getImageSrc } from "@/lib/utils";

interface CategoryGridProps {
  categories: Category[];
  allCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CategoryGrid({
  categories,
  allCategories,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryGridProps) {
  const getCategoryName = (id: string) => {
    return allCategories.find((c) => c._id === id)?.name || "—";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500 font-medium">No categories found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {categories.map((category) => {
        const imageUrl = category?.image ? getImageSrc(category?.image) : "";

        return (
          <Card
            key={category?._id}
            className="group relative overflow-hidden border border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 rounded-xl hover:border-gray-300 p-0"
          >
            {/* Image Section */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={category?.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ImageIcon className="h-14 w-14 text-gray-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}

              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm backdrop-blur-sm transition-all ${
                  category?.isActive
                    ? "bg-emerald-50/90 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/20"
                    : "bg-gray-100/90 text-gray-600 border-gray-200 ring-1 ring-gray-900/10"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    category?.isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {category?.isActive ? "Active" : "Inactive"}
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
                        onClick={() => onEdit(category)}
                        className="text-sm rounded-lg focus:bg-gray-50 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4 mr-2.5 text-gray-500" />
                        Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(category?._id)}
                        className="text-sm rounded-lg focus:bg-gray-50 cursor-pointer"
                      >
                        {category?.isActive ? (
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
                        onClick={() => onDelete(category?._id)}
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
                  {category?.name}
                </h3>
                {category?.parentCategory && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="text-gray-400">Parent:</span>
                    <span className="font-medium">
                      {getCategoryName(category?.parentCategory)}
                    </span>
                  </p>
                )}
              </div>

              {category?.description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {category?.description}
                </p>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {formatDate(category?.createdAt)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
