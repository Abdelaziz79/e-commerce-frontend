// components/users/admin/UserInfoCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AdminUser } from "@/types/admin";
import { Calendar, Mail, Phone, ShieldAlert, User } from "lucide-react";

interface UserInfoCardProps {
  user: AdminUser;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isRestricted = user.status === "banned" || user.status === "suspended";

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Account Information
        </CardTitle>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="pt-6">
        <dl className="grid gap-6 sm:grid-cols-2">
          {/* Email */}
          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> Email Address
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {user.email}
            </dd>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" /> Phone Number
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {user.phone || "Not provided"}
            </dd>
          </div>

          {/* Joined */}
          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Member Since
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDate(user.createdAt)}
            </dd>
          </div>

          {/* Last Updated */}
          <div className="space-y-1.5">
            <dt className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Last Updated
            </dt>
            <dd className="text-sm font-medium text-foreground">
              {formatDate(user.updatedAt)}
            </dd>
          </div>

          {/* Ban/Suspend Info (Conditional) */}
          {isRestricted && (
            <div className="sm:col-span-2 mt-2">
              <div
                className={`rounded-lg border p-4 ${
                  user.status === "banned"
                    ? "bg-red-50/50 border-red-100"
                    : "bg-yellow-50/50 border-yellow-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <ShieldAlert
                    className={`h-5 w-5 mt-0.5 ${
                      user.status === "banned"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  />
                  <div className="space-y-2 flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        user.status === "banned"
                          ? "text-red-900"
                          : "text-yellow-900"
                      }`}
                    >
                      {user.status === "banned"
                        ? "Account Banned"
                        : "Account Suspended"}
                    </p>
                    <div
                      className={`text-sm space-y-1.5 ${
                        user.status === "banned"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {user.banReason && (
                        <p>
                          <span className="font-medium">Reason:</span>{" "}
                          {user.banReason}
                        </p>
                      )}
                      {user.bannedAt && (
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(user.bannedAt)}
                        </p>
                      )}
                      {user.bannedBy && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <User className="h-3.5 w-3.5" />
                          <p>
                            <span className="font-medium">By:</span>{" "}
                            {user.bannedBy.name} ({user.bannedBy.email})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
