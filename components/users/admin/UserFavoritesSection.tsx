// components/users/admin/UserFavoritesSection.tsx - FIXED VERSION
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { AdminFavoriteItem } from "@/types/admin";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils";
import Link from "next/link";

interface UserFavoritesSectionProps {
  favorites: AdminFavoriteItem[]; // CHANGED from Product[]
}

export function UserFavoritesSection({ favorites }: UserFavoritesSectionProps) {
  if (!favorites || favorites.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favorites
          </CardTitle>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">No favorite items</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // FIXED: Filter and extract products properly
  const validFavorites = favorites.filter(
    (fav) => fav.product && typeof fav.product === "object"
  );

  if (validFavorites.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favorites
          </CardTitle>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">Favorite products are no longer available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          Favorites ({validFavorites.length} items)
        </CardTitle>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {validFavorites.map((favorite) => {
            // FIXED: Safely extract product
            const product = favorite.product as Product;

            // Get the product image safely
            const productImage =
              product.mainImage ||
              (product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder-image.png");

            return (
              <Link
                key={favorite._id || product._id}
                href={`/products/${product._id}`}
                className="flex gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 hover:border-border transition-all group"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border border-border/50">
                  <Image
                    src={getImageSrc(productImage)}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-base font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.onSale && product.salePrice && (
                      <Badge
                        variant="destructive"
                        className="text-xs px-1.5 py-0"
                      >
                        Sale
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {product.countInStock > 0 ? (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 border-green-200 text-green-700 bg-green-50"
                      >
                        In Stock
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs px-1.5 py-0 border-red-200 text-red-700 bg-red-50"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
