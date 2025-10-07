// components/admin/orders/ShippingInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";

export function ShippingInfoCard({
  shipping,
}: {
  shipping: Order["shipping"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {shipping?.carrier && shipping.trackingNumber ? (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carrier</span>
              <span className="font-medium">{shipping.carrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking #</span>
              <span className="font-medium break-all">
                {shipping.trackingNumber}
              </span>
            </div>
            {shipping.shippedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipped On</span>
                <span className="font-medium">
                  {new Date(shipping.shippedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">
            No tracking information added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
