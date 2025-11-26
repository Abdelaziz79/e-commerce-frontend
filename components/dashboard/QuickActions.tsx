// components/dashboard/QuickActions.tsx
"use client";

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
    label: "Orders",
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
    href: "/settings",
    icon: MapPin,
    description: "Manage",
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
    description: "Account",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="p-2.5 rounded-lg bg-slate-50 group-hover:bg-blue-100 transition-colors">
                <action.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-900 block">
                  {action.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">
                  {action.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
