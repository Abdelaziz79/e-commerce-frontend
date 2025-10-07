// ===== components/ErrorState.tsx =====
import { XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  error: Error;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="p-12 text-center max-w-md border-0 bg-muted/50">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-destructive/10">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </Card>
    </div>
  );
}
