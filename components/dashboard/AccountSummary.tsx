// components/dashboard/AccountSummary.tsx
"use client";

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
import { Button } from "@/components/ui/button";

interface AccountSummaryProps {
  user: UserProfile;
}

export function AccountSummary({ user }: AccountSummaryProps) {
  const defaultAddress = user.addresses.find((addr) => addr.isDefault);

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">Account Info</h3>
      </div>
      <div className="p-5 space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-blue-50 flex-shrink-0">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 mb-1">Email</p>
            <p className="text-sm text-slate-900 truncate">{user.email}</p>
            {user.isEmailVerified ? (
              <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>Not verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        {user.phone && (
          <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 flex-shrink-0">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 mb-1">Phone</p>
              <p className="text-sm text-slate-900">{user.phone}</p>
            </div>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-50 flex-shrink-0">
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Default Address
            </p>
            {defaultAddress ? (
              <div className="text-sm text-slate-900 space-y-0.5">
                <p className="line-clamp-1">{defaultAddress.address}</p>
                <p className="text-xs text-slate-500">
                  {defaultAddress.city}, {defaultAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No address set</p>
            )}
          </div>
        </div>

        {/* Manage Button */}
        <div className="pt-3">
          <Button
            variant="outline"
            className="w-full group text-slate-900 border-slate-300 hover:bg-slate-50"
            asChild
            size="sm"
          >
            <Link
              href="/settings"
              className="flex items-center justify-between"
            >
              <span className="text-xs font-medium">Manage Account</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
