"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlignJustify, Grid2x2, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";

export type ViewMode = "grid-3" | "grid-4" | "list";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewModeToggle({ viewMode, setViewMode }: ViewModeToggleProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-gray-300 h-9  p-0.5 sm:p-1 ">
      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("grid-3")}
          className={cn(
            "h-5 sm:h-6  p-1 transition-all",
            viewMode === "grid-3"
              ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          )}
          title="3 Columns Grid"
        >
          <Grid2x2 className="h-2 w-2 sm:h-4 sm:w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode(isMobile ? "grid-3" : "grid-4")}
        className={cn(
          "h-5 sm:h-6  p-1 transition-all",
          viewMode === "grid-4" || (isMobile && viewMode === "grid-3")
            ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
        title={isMobile ? "Grid View" : "4 Columns Grid"}
      >
        <LayoutGrid className="h-2 w-2 sm:h-4 sm:w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode("list")}
        className={cn(
          "h-5 sm:h-6  p-1 transition-all",
          viewMode === "list"
            ? "bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        )}
        title="List View"
      >
        <AlignJustify className="h-2 w-2 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}
