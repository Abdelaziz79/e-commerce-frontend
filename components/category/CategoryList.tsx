// ===== components/CategoryList.tsx =====
import Image from "next/image";
import { ImageIcon, Pencil, Trash2, MoreHorizontal } from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/types/category";

interface CategoryListProps {
  categories: Category[];
  allCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({
  categories,
  allCategories,
  onEdit,
  onDelete,
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
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Parent</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category._id} className="group">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                    {category.image ? (
                      <Image
                        src={category.image}
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
                <Badge
                  variant={category.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
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
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
