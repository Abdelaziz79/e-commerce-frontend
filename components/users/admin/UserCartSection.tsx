// components/users/admin/UserCartSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types/cart";
import { ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils";
import Link from "next/link";

interface UserCartSectionProps {
  cartItems: CartItem[];
}

export function UserCartSection({ cartItems }: UserCartSectionProps) {
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">Cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({cartItems.length} items)
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">
            ${cartTotal.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="pt-6">
        <div className="space-y-4">
          {cartItems.map((item, index) => {
            const productId =
              typeof item.product === "string"
                ? item.product
                : item.product._id;

            return (
              <div
                key={`${productId}-${item.variation?.sku || index}`}
                className="flex gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border border-border/50">
                  <Image
                    src={getImageSrc(item.image)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${productId}`}
                    className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  {item.variation && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.variation.size && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          Size: {item.variation.size}
                        </Badge>
                      )}
                      {item.variation.color && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          Color: {item.variation.color}
                        </Badge>
                      )}
                      {item.variation.sku && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0 font-mono"
                        >
                          {item.variation.sku}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-sm font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {item.stockStatus && item.stockStatus !== "available" && (
                    <Badge
                      variant="destructive"
                      className="text-xs mt-1.5 px-1.5 py-0"
                    >
                      {item.stockStatus === "out_of_stock"
                        ? "Out of Stock"
                        : "Unavailable"}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
