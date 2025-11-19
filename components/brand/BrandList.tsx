// components/brand/BrandList.tsx

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
import type { Brand } from "@/types/brand";
import { getImageSrc } from "@/lib/utils";

interface BrandListProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function BrandList({
  brands,
  onEdit,
  onDelete,
  onToggleStatus,
}: BrandListProps) {
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
              Brand
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Description
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Website
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
          {brands.map((brand) => {
            const imageUrl = brand?.logo ? getImageSrc(brand?.logo) : "";

            return (
              <TableRow
                key={brand?._id}
                className="group hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 last:border-0"
              >
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden ring-1 ring-gray-900/5">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={brand?.name}
                          width={44}
                          height={44}
                          className="object-contain w-full h-full p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {brand?.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6">
                  <Badge
                    variant="outline"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors ${
                      brand?.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10"
                        : "bg-gray-100 text-gray-600 border-gray-200 ring-1 ring-gray-900/5"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        brand?.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {brand?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                <TableCell className="px-6 max-w-xs">
                  <p className="text-sm text-gray-600 truncate">
                    {brand?.description || (
                      <span className="text-gray-400">No description</span>
                    )}
                  </p>
                </TableCell>

                <TableCell className="px-6">
                  {brand?.website ? (
                    <a
                      href={brand?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </TableCell>

                <TableCell className="px-6">
                  <span className="text-xs text-gray-500 font-medium">
                    {formatDate(brand?.createdAt)}
                  </span>
                </TableCell>

                <TableCell className="px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {brands.length === 0 && (
        <div className="py-16 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">No brands found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
