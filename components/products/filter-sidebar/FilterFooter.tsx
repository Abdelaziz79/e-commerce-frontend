import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterFooterProps {
  hasActiveFilters: boolean;
  onReset: () => void;
}

export function FilterFooter({ hasActiveFilters, onReset }: FilterFooterProps) {
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-200 lg:hidden bg-white flex-shrink-0">
      <Button
        onClick={onReset}
        className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold"
      >
        <X className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  );
}
