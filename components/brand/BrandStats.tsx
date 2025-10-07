// ===== components/brand/BrandStats.tsx =====
import { Card } from "@/components/ui/card";

interface BrandStatsProps {
  stats: {
    total: number;
    withLogo: number;
    withWebsite: number;
  };
}

export function BrandStats({ stats }: BrandStatsProps) {
  const statItems = [
    { label: "Total Brands", value: stats.total, color: "text-foreground" },
    {
      label: "With Logo",
      value: stats.withLogo,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "With Website",
      value: stats.withWebsite,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {statItems.map((stat) => (
        <Card key={stat.label} className="p-4 border-0 bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {stat.label}
          </p>
          <p className={`text-2xl font-semibold tabular-nums ${stat.color}`}>
            {stat.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
