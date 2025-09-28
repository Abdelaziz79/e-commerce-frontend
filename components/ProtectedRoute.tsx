// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/hooks/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requireEmailVerification = false,
}: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.push("/sign-in");
        return;
      }

      if (requireEmailVerification && !user.isEmailVerified) {
        router.push("/verify-email");
        return;
      }
    }
  }, [user, token, isLoading, router, requireEmailVerification]);

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

  return <>{children}</>;
}
