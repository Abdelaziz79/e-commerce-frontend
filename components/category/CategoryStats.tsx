// ===== components/CategoryStats.tsx =====
import { Card } from "@/components/ui/card";

interface CategoryStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    parent: number;
    child: number;
  };
}

export function CategoryStats({ stats }: CategoryStatsProps) {
  const statItems = [
    { label: "Total", value: stats.total, color: "text-foreground" },
    {
      label: "Active",
      value: stats.active,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      color: "text-muted-foreground",
    },
    {
      label: "Parents",
      value: stats.parent,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Children",
      value: stats.child,
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
