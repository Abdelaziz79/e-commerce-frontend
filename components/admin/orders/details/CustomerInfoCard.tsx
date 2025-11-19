// components/admin/orders/details/CustomerInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { Mail, User } from "lucide-react";

interface CustomerInfoCardProps {
  order: Order;
}

export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  const user = typeof order.user === "object" ? order.user : null;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <User className="h-4 w-4 text-gray-500" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <User className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-medium text-gray-900">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
