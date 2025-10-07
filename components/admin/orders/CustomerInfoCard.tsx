// components/admin/orders/CustomerInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";

interface CustomerInfoCardProps {
  user: Order["user"];
  shippingAddress: Order["shippingAddress"];
}

export function CustomerInfoCard({
  user,
  shippingAddress,
}: CustomerInfoCardProps) {
  const customerName = typeof user === "object" ? user.name : "N/A";
  const customerEmail = typeof user === "object" ? user.email : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{customerEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Address</span>
          <span className="font-medium text-right">
            {shippingAddress.address}, {shippingAddress.city}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
