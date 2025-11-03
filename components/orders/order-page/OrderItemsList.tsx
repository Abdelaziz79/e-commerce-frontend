// components/orders/order-page/OrderItemsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderItem } from "@/types/order";
import Image from "next/image";
import Link from "next/link";

interface OrderItemsListProps {
  items: OrderItem[];
}

// Helper function to safely get product ID
const getProductId = (product: string | { _id: string }): string => {
  if (typeof product === "string") {
    return product;
  }
  return product._id;
};

// Helper function to safely get product slug
const getProductSlug = (
  product: string | { _id: string; slug?: string }
): string | null => {
  if (typeof product === "object" && "slug" in product && product.slug) {
    return product.slug;
  }
  return null;
};

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items Ordered ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const productId = getProductId(item.product);
            const productSlug = getProductSlug(item.product);
            // Use slug if available, otherwise use ID
            const productHref = productSlug
              ? `/products/${productSlug}`
              : `/products/${productId}`;

            return (
              <div key={`${productId}-${index}`}>
                <div className="flex items-start gap-4 py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={productHref}
                      className="font-semibold hover:underline line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quantity: {item.quantity}
                    </p>
                    {item.variation && (
                      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        {item.variation.sku && <p>SKU: {item.variation.sku}</p>}
                        {item.variation.size && (
                          <p>Size: {item.variation.size}</p>
                        )}
                        {item.variation.color && (
                          <p>Color: {item.variation.color}</p>
                        )}
                        {item.variation.material && (
                          <p>Material: {item.variation.material}</p>
                        )}
                        {item.variation.style && (
                          <p>Style: {item.variation.style}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-medium">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground font-normal">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
                {index < items.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
