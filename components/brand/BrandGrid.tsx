// ===== components/brand/BrandGrid.tsx =====
import Image from "next/image";
import {
  Package,
  Pencil,
  Trash2,
  MoreHorizontal,
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Brand } from "@/types/brand";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {brands.map((brand) => {
        const logoUrl = brand.logo
          ? brand.logo.startsWith("http")
            ? brand.logo
            : `${API_BASE_URL}${brand.logo}`
          : "";
        return (
          <Card
            key={brand._id}
            className="group overflow-hidden border-0 bg-card hover:shadow-md transition-shadow pt-0"
          >
            <div className="aspect-[16/9] bg-muted relative overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brand.name}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground/50" />
              )}
              <Badge
                variant={brand.isActive ? "default" : "outline"}
                className={`absolute top-2 left-2 text-xs ${
                  brand.isActive
                    ? "bg-green-600/80 border-transparent text-white"
                    : "bg-card/80 text-card-foreground"
                }`}
              >
                {brand.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{brand.name}</h3>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                      Visit website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(brand)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(brand._id)}>
                      {brand.isActive ? (
                        <ToggleLeft className="h-4 w-4 mr-2" />
                      ) : (
                        <ToggleRight className="h-4 w-4 mr-2" />
                      )}
                      <span>{brand.isActive ? "Deactivate" : "Activate"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(brand._id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {brand.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {brand.description}
                </p>
              )}

              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {formatDate(brand.createdAt)}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
