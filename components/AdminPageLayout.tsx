// app/admin/components/AdminPageLayout.tsx
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from "react";

interface AdminPageLayoutProps {
  title: string;
  subtitle: string;
  actionButtonTitle: string;
  onActionButtonClick: () => void;
  children: React.ReactNode;
}

export function AdminPageLayout({
  title,
  subtitle,
  actionButtonTitle,
  onActionButtonClick,
  children,
}: AdminPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          <Button onClick={onActionButtonClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {actionButtonTitle}
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {children}
        </div>
      </div>
    </div>
  );
}
