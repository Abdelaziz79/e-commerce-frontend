// components/admin/orders/details/OrderItemsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { Package } from "lucide-react";
import Image from "next/image";

interface OrderItemsCardProps {
  order: Order;
}

export function OrderItemsCard({ order }: OrderItemsCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Package className="h-4 w-4 text-gray-500" />
          Order Items ({order.orderItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {order.orderItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative h-20 w-20 bg-white border border-gray-200 rounded-lg flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {item.name}
                </h3>
                {item.variation && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Object.entries(item.variation)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs px-2 py-0.5 bg-white border border-gray-200 text-gray-600 rounded"
                        >
                          {key}: {value}
                        </span>
                      ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Qty: {item.quantity}</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">
                    ${item.price.toFixed(2)} each
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
