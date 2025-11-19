// components/category/CategoryList.tsx
import Image from "next/image";
import {
  ImageIcon,
  Pencil,
  Trash2,
  MoreVertical,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";
import { getImageSrc } from "@/lib/utils";

interface CategoryListProps {
  categories: Category[];
  allCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function CategoryList({
  categories,
  allCategories,
  onEdit,
  onDelete,
  onToggleStatus,
}: CategoryListProps) {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-50 hover:to-gray-100/50 border-b border-gray-200">
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Category
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Parent
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Created
            </TableHead>
            <TableHead className="h-11 w-[100px] text-xs font-semibold text-gray-700 uppercase tracking-wider text-right pr-6">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const imageUrl = category?.image
              ? getImageSrc(category?.image)
              : "";

            return (
              <TableRow
                key={category?._id}
                className="group hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 last:border-0"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden ring-1 ring-gray-900/5">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category?.name}
                          width={44}
                          height={44}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {category?.name}
                      </p>
                      {category?.parentCategory && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {getCategoryName(category?.parentCategory)}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6">
                  <Badge
                    variant="outline"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors ${
                      category?.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10"
                        : "bg-gray-100 text-gray-600 border-gray-200 ring-1 ring-gray-900/5"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        category?.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {category?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="px-6 max-w-xs">
                  <p className="text-sm text-gray-600 truncate">
                    {category?.description || (
                      <span className="text-gray-400">No description</span>
                    )}
                  </p>
                </TableCell>

                <TableCell className="px-6">
                  <span className="text-sm text-gray-600">
                    {category?.parentCategory ? (
                      getCategoryName(category?.parentCategory)
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </span>
                </TableCell>

                <TableCell className="px-6">
                  <span className="text-xs text-gray-500 font-medium">
                    {formatDate(category?.createdAt)}
                  </span>
                </TableCell>

                <TableCell className="px-6 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {categories.length === 0 && (
        <div className="py-16 text-center">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">
            No categories found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
