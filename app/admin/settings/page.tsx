// app/admin/settings/page.tsx
"use client";

import { DiscountCodesTab } from "@/components/admin/settings/DiscountCodesTab";
import { GeneralSettingsTab } from "@/components/admin/settings/GeneralSettingsTab";
import { ShippingRatesTab } from "@/components/admin/settings/ShippingRatesTab";
import { TaxRatesTab } from "@/components/admin/settings/TaxRatesTab";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Settings, Tag, Truck } from "lucide-react";
import { useState } from "react";

function AdminSettingsContent() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        <PageHeader
          pageTitle="Store Settings"
          pageDescription="Manage your store configuration, taxes, shipping, and discount codes"
          pageButtons={[]}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-white border border-gray-200 p-1 rounded-none">
            <TabsTrigger
              value="general"
              className="gap-2 rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger
              value="tax"
              className="gap-2 rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Tax Rates</span>
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="gap-2 rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Shipping</span>
            </TabsTrigger>
            <TabsTrigger
              value="discounts"
              className="gap-2 rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Discounts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettingsTab />
          </TabsContent>

          <TabsContent value="tax">
            <TaxRatesTab />
          </TabsContent>

          <TabsContent value="shipping">
            <ShippingRatesTab />
          </TabsContent>

          <TabsContent value="discounts">
            <DiscountCodesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute userType="admin">
      <AdminSettingsContent />
    </ProtectedRoute>
  );
}
