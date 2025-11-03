// components/orders/order-page/OrderStatusTimeline.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatOrderStatus } from "@/hooks/use-orders";
import { StatusHistory } from "@/types/order";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface OrderStatusTimelineProps {
  history: StatusHistory[];
}

const getStatusIcon = (status: string) => {
  if (status.includes("delivered") || status.includes("completed"))
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (status.includes("shipped"))
    return <Truck className="h-5 w-5 text-blue-500" />;
  if (status.includes("processing"))
    return <Package className="h-5 w-5 text-blue-500" />;
  if (status.includes("cancelled") || status.includes("failed"))
    return <XCircle className="h-5 w-5 text-red-500" />;
  if (status.includes("on-hold"))
    return <AlertCircle className="h-5 w-5 text-orange-500" />;
  return <Clock className="h-5 w-5 text-gray-500" />;
};

export function OrderStatusTimeline({ history }: OrderStatusTimelineProps) {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {history
            .slice()
            .reverse()
            .map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-background border rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(event.status)}
                  </div>
                  {index < history.length - 1 && (
                    <div
                      className="w-px flex-1 bg-border mt-2"
                      style={{ minHeight: "2rem" }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-semibold">
                    {formatOrderStatus(event.status)}
                  </p>
                  {event.note && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.note}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
