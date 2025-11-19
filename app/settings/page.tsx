"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import AddressSection from "@/components/settings/AddressSection";
import ProfileSection from "@/components/settings/ProfileSection";
import SecuritySection from "@/components/settings/SecuritySection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Main Settings Page
export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your account preferences and settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-none">
              <TabsTrigger
                value="profile"
                className="text-sm data-[state=active]:bg-white rounded-none"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-sm data-[state=active]:bg-white rounded-none"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="addresses"
                className="text-sm data-[state=active]:bg-white rounded-none"
              >
                Addresses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSection />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySection />
            </TabsContent>

            <TabsContent value="addresses" className="space-y-6">
              <AddressSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
