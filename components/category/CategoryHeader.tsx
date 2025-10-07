// ===== components/CategoryHeader.tsx =====
import { FolderTree } from "lucide-react";

export function CategoryHeader() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <FolderTree className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Manage your product categories and hierarchy
      </p>
    </div>
  );
}
