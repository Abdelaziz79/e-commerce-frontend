// components/admin/orders/details/StatusHistoryCard.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatOrderStatus, useOrderStatusColor } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface StatusHistoryCardProps {
  order: Order;
}

export function StatusHistoryCard({ order }: StatusHistoryCardProps) {
  const getStatusColor = useOrderStatusColor;

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Calendar className="h-4 w-4 text-gray-500" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3">
          {order.statusHistory.map((history, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex-shrink-0">
                <Badge
                  variant="outline"
                  className={`${getStatusColor(
                    history.status
                  )} text-xs px-2 py-0.5 rounded-full`}
                >
                  {formatOrderStatus(history.status)}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">
                  {format(new Date(history.date), "MMM d, yyyy 'at' h:mm a")}
                </p>
                {history.note && (
                  <p className="text-xs text-gray-700 mt-1">{history.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
