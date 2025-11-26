// components/admin/orders/details/OrderSummaryCard.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { FileText, Tag } from "lucide-react";

interface OrderSummaryCardProps {
  order: Order;
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <FileText className="h-4 w-4 text-gray-500" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Item(s) Price</span>
          <span className="text-gray-900">${order.itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${order.taxPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            ${order.shippingPrice.toFixed(2)}
          </span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600 font-medium">
              -${order.discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        {order.discount && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              <Badge variant="outline" className="text-xs">
                {order.discount.code}
              </Badge>
              <span className="text-xs text-gray-500">
                ({order.discount.value}
                {order.discount.type === "percentage" ? "%" : "$"} off)
              </span>
            </div>
          </div>
        )}
        <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${order.totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
