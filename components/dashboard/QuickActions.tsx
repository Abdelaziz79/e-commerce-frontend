// components/dashboard/QuickActions.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Package,
  MapPin,
  Settings,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    label: "My Orders",
    href: "/orders",
    icon: Package,
    description: "Track orders",
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    description: "View cart",
  },
  {
    label: "Favorites",
    href: "/wishlist",
    icon: Heart,
    description: "Saved items",
  },
  {
    label: "Addresses",
    href: "settings",
    icon: MapPin,
    description: "Manage addresses",
  },
  {
    label: "Reviews",
    href: "/reviews",
    icon: MessageSquare,
    description: "My reviews",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
];

export function QuickActions() {
  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 bg-white">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-gray-200 hover:bg-gray-50 transition-all"
            >
              <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-white transition-colors">
                <action.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-900 block">
                  {action.label}
                </span>
                <span className="text-xs text-gray-500">
                  {action.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
