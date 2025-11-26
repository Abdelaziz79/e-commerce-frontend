// components/users/admin/UserStatsGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStatistics } from "@/types/admin";
import {
  CreditCard,
  Heart,
  Package,
  ShoppingCart,
  Star,
  Wallet,
} from "lucide-react";

interface UserStatsGridProps {
  stats: UserStatistics;
}

export function UserStatsGrid({ stats }: UserStatsGridProps) {
  const metrics = [
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: Wallet,
      desc: "Lifetime value",
    },
    {
      title: "Avg. Order",
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      icon: CreditCard,
      desc: "Per transaction",
    },
    {
      title: "Total Orders",
      value: stats.orderCount,
      icon: Package,
      desc: "Completed orders",
    },
    {
      title: "Reviews",
      value: stats.reviewCount,
      icon: Star,
      desc: "Product feedback",
    },
    {
      title: "Cart Items",
      value: stats.cartItems,
      icon: ShoppingCart,
      desc: "Currently in cart",
    },
    {
      title: "Favorites",
      value: stats.favoriteItems,
      icon: Heart,
      desc: "Saved items",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="border-border/60 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground/70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
