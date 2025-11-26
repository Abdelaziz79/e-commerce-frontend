// components/admin/dashboard/QuickActions.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Filter,
  Info,
  Package,
  ScrollText,
  Settings,
  ShoppingCart,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "Website Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    label: "Manage Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "View Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Manage Categories",
    href: "/admin/categories",
    icon: Filter,
  },
  {
    label: "Manage Brands",
    href: "/admin/brands",
    icon: BarChart3,
  },
  {
    label: "Manage Reviews",
    href: "/admin/reviews",
    icon: ScrollText,
  },
  {
    label: "Stock Overview",
    href: "/admin/stock",
    icon: Info,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                {action.label}
              </span>
              <action.icon className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
