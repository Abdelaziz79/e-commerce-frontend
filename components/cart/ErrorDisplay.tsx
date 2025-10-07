// components/cart/ErrorDisplay.tsx
import { Card } from "@/components/ui/card";

export function ErrorDisplay() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 text-center">
        <p className="text-red-500">Failed to load cart. Please try again.</p>
      </Card>
    </div>
  );
}
