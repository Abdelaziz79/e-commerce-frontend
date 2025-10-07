// ===== components/CategoryGrid.tsx =====
import Image from "next/image";
import { ImageIcon, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";

interface CategoryGridProps {
  categories: Category[];
  allCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryGrid({
  categories,
  allCategories,
  onEdit,
  onDelete,
}: CategoryGridProps) {
  const getCategoryName = (id: string) => {
    return allCategories.find((c) => c._id === id)?.name || "None";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card
          key={category._id}
          className="group overflow-hidden border-0 bg-card hover:shadow-md transition-shadow pt-0"
        >
          <div className="aspect-[16/9] bg-muted relative overflow-hidden">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{category.name}</h3>
                {category.parentCategory && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {getCategoryName(category.parentCategory)}
                  </p>
                )}
              </div>
              <Badge
                variant={category.isActive ? "default" : "secondary"}
                className="shrink-0 text-xs"
              >
                {category.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {formatDate(category.createdAt)}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(category)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(category._id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
