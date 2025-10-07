// components/orders/order-page/OrderInfoCard.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Detail {
  label: string;
  value: string;
  isBadge?: boolean;
  color?: "green" | "yellow" | "red" | "blue";
}

interface OrderInfoCardProps {
  title: string;
  details: Detail[];
}

export function OrderInfoCard({ title, details }: OrderInfoCardProps) {
  const badgeColorClasses = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {details.map((detail) => (
          <div key={detail.label} className="flex justify-between items-center">
            <span className="text-muted-foreground">{detail.label}</span>
            {detail.isBadge ? (
              <Badge
                variant="outline"
                className={detail.color ? badgeColorClasses[detail.color] : ""}
              >
                {detail.value}
              </Badge>
            ) : (
              <span className="font-medium text-right">{detail.value}</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
