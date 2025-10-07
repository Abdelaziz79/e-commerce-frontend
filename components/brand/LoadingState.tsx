// ===== components/brand/LoadingState.tsx =====
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">Loading brands...</p>
      </div>
    </div>
  );
}
