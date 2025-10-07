// components/shared/ErrorDisplay.tsx
import { Card } from "@/components/ui/card";

interface ErrorDisplayProps {
  message?: string;
}

export function ErrorDisplay({
  message = "An unexpected error occurred.",
}: ErrorDisplayProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 text-center">
        <p className="text-red-500">{message}</p>
      </Card>
    </div>
  );
}
