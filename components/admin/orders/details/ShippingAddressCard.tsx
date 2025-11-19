// components/admin/orders/details/ShippingAddressCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { MapPin, Phone } from "lucide-react";

interface ShippingAddressCardProps {
  order: Order;
}

export function ShippingAddressCard({ order }: ShippingAddressCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <MapPin className="h-4 w-4 text-gray-500" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-2">
        <p className="text-sm text-gray-900">{order.shippingAddress.address}</p>
        <p className="text-sm text-gray-900">
          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        </p>
        <p className="text-sm text-gray-900">{order.shippingAddress.country}</p>
        {order.shippingAddress.phoneNumber && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-sm text-gray-900">
              {order.shippingAddress.phoneNumber}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
