// components/admin/dashboard/DashboardHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface DashboardHeaderProps {
  dateRange: string;
  onRangeChange: (value: string) => void;
}

export function DashboardHeader({
  dateRange,
  onRangeChange,
}: DashboardHeaderProps) {
  const handleExport = () => {
    toast.success("Exporting dashboard report...");
  };

  return (
    // FIX: Standard flow (not sticky), w-full
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of your store&apos;s performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={onRangeChange}>
              <SelectTrigger className="w-[180px] bg-white h-9 text-sm">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2 h-9"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
