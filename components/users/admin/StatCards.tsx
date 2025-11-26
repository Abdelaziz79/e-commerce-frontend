// components/users/admin/StatCards.tsx
"use client";

import StatCard from "@/components/shared/StatCard";
import { Users, UserCheck, AlertCircle, Shield } from "lucide-react";
import { UserStats } from "@/types/admin";

interface StatCardsProps {
  stats: UserStats;
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={Users}
        iconColor="text-gray-500"
      />
      <StatCard
        title="Active Users"
        value={stats.activeUsers.toLocaleString()}
        icon={UserCheck}
        iconColor="text-green-500"
      />
      <StatCard
        title="Banned"
        value={stats.bannedUsers.toLocaleString()}
        icon={AlertCircle}
        iconColor="text-red-500"
      />
      <StatCard
        title="Admin Users"
        value={stats.adminUsers.toLocaleString()}
        icon={Shield}
        iconColor="text-blue-500"
      />
    </div>
  );
}
