// components/dashboard/AccountSummary.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface AccountSummaryProps {
  user: UserProfile;
}

export function AccountSummary({ user }: AccountSummaryProps) {
  const defaultAddress = user.addresses.find((addr) => addr.isDefault);

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 bg-white">
        <CardTitle className="text-lg font-semibold">Account Info</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
            <Mail className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-900 truncate">{user.email}</p>
            {user.isEmailVerified ? (
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>Not verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        {user.phone && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
              <Phone className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-sm text-gray-900">{user.phone}</p>
            </div>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
            <MapPin className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Default Address
            </p>
            {defaultAddress ? (
              <div className="text-sm text-gray-900 space-y-0.5">
                <p className="line-clamp-1">{defaultAddress.address}</p>
                <p className="text-xs text-gray-500">
                  {defaultAddress.city}, {defaultAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No address set</p>
            )}
          </div>
        </div>

        {/* Manage Button */}
        <div className="pt-2">
          <Button variant="outline" className="w-full group" asChild size="sm">
            <Link
              href="/settings"
              className="flex items-center justify-between"
            >
              <span>Manage Account</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
