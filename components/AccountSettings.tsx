// app/account/page.tsx
"use client";

import { useState } from "react";
import { Settings, Mail, User, Lock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/account/profile-form";
import { SecurityForm } from "@/components/account/security-form";
import { AddressManager } from "@/components/account/address-manager";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileForm />;
      case "security":
        return <SecurityForm />;
      case "addresses":
        return <AddressManager />;
      default:
        return <ProfileForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Account Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account preferences and personal information
              </p>
            </div>
          </div>
        </div>

        {/* Email Verification Banner */}
        {user && !user.isEmailVerified && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-amber-600 mr-3" />
              <div className="flex-1">
                <h3 className="font-medium text-amber-800">
                  Email Verification Required
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Please verify your email address to access all account
                  features.
                </p>
              </div>
              <Button size="sm" variant="outline">
                Resend Email
              </Button>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
