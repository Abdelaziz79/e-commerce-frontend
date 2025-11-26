// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/hooks/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-mutations";

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
  userType?: "user" | "admin";
}

export function ProtectedRoute({
  children,
  requireEmailVerification = false,
  userType = "user",
}: ProtectedRouteProps) {
  const { token, isLoading } = useAuth();
  const { data: userData, isLoading: isLoadingProfile } = useUserProfile();
  const user = userData?.data;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoadingProfile) {
      if (!token || !user) {
        router.push("/sign-in");
        return;
      }

      if (requireEmailVerification && !user.isEmailVerified) {
        router.push("/verify-email");
        return;
      }
      if (userType === "admin" && user.role !== "admin") {
        router.push("/");
        return;
      }
    }
  }, [
    user,
    token,
    isLoading,
    router,
    requireEmailVerification,
    userType,
    isLoadingProfile,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return null;
  }

  if (requireEmailVerification && !user.isEmailVerified) {
    return null;
  }

  if (userType === "admin" && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
