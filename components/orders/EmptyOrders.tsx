// components/orders/EmptyOrders.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import Link from "next/link";

interface EmptyOrdersProps {
  hasSearch: boolean;
}

export function EmptyOrders({ hasSearch }: EmptyOrdersProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          {hasSearch
            ? "Your search returned no orders. Try a different search term or filter."
            : "You haven't placed any orders yet. When you do, they will appear here."}
        </p>
        {!hasSearch && (
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
