// components/orders/order-page/OrderItemsList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderItem } from "@/types/order";
import Image from "next/image";
import Link from "next/link";

interface OrderItemsListProps {
  items: OrderItem[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items Ordered ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.product}>
              <div className="flex items-start gap-4 py-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product}`}
                    className="font-semibold hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right font-medium">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
              {index < items.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
