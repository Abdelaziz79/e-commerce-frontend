// components/admin/orders/details/PaymentInfoCard.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";

interface PaymentInfoCardProps {
  order: Order;
}

export function PaymentInfoCard({ order }: PaymentInfoCardProps) {
  const paymentMethods: Record<string, string> = {
    card: "Credit Card",
    paypal: "PayPal",
    cod: "Cash on Delivery",
    bank: "Bank Transfer",
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <CreditCard className="h-4 w-4 text-gray-500" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Method</span>
          <span className="text-sm font-medium text-gray-900">
            {paymentMethods[order.paymentMethod] || order.paymentMethod}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 rounded-full ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
        {order.paidAt && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">Paid on</p>
            <p className="text-sm text-gray-900">
              {format(new Date(order.paidAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        )}
        {order.notes && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Customer Note</p>
            <p className="text-sm text-gray-900">{order.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
