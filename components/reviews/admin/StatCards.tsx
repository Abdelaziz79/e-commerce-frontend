// components/reviews/admin/StatCards.tsx
"use client";

import StatCard from "@/components/shared/StatCard";
import { MessageSquare, Star, ThumbsUp, CheckCircle } from "lucide-react";

interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  totalHelpfulVotes: number;
  verifiedPurchases: number;
}

interface StatCardsProps {
  stats: ReviewStats;
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
      <StatCard
        title="Total Reviews"
        value={stats.totalReviews.toLocaleString()}
        icon={MessageSquare}
        iconColor="text-gray-500"
      />
      <StatCard
        title="Avg Rating"
        value={stats.avgRating.toFixed(1)}
        icon={Star}
        iconColor="text-yellow-500"
      />
      <StatCard
        title="Helpful Votes"
        value={stats.totalHelpfulVotes.toLocaleString()}
        icon={ThumbsUp}
        iconColor="text-blue-500"
      />
      <StatCard
        title="Verified Purchase"
        value={stats.verifiedPurchases.toLocaleString()}
        icon={CheckCircle}
        iconColor="text-green-500"
      />
    </div>
  );
}
