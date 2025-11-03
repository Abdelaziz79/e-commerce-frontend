// components/category/CategoryList.tsx
import Image from "next/image";
import {
  ImageIcon,
  Pencil,
  Trash2,
  MoreHorizontal,
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
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

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
    <Card className="border-0 bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-medium">Category</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Parent</TableHead>
            <TableHead className="font-medium">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const imageUrl = category.image
              ? category.image.startsWith("http")
                ? category.image
                : `${API_BASE_URL}${category.image}`
              : "";

            return (
              <TableRow key={category._id} className="group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={category.isActive ? "default" : "outline"}
                    className={`text-xs ${
                      category.isActive
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800"
                        : ""
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm text-muted-foreground">
                    {category.description || "—"}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {category.parentCategory
                      ? getCategoryName(category.parentCategory)
                      : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(category.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(category._id)}
                      >
                        {category.isActive ? (
                          <ToggleLeft className="h-4 w-4 mr-2" />
                        ) : (
                          <ToggleRight className="h-4 w-4 mr-2" />
                        )}
                        <span>
                          {category.isActive ? "Deactivate" : "Activate"}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(category._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
    </Card>
  );
}
