// app/verify-email/[token]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "@/hooks/use-auth-mutations";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params?.token as string;

  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Invalid Verification Link
              </h2>
              <p className="text-sm text-gray-600">
                The email verification link is invalid or malformed.
              </p>
            </div>

            <Link href="/">
              <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-none font-medium transition-colors">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (verifyEmailMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Verifying your email...
              </h2>
              <p className="text-sm text-gray-600">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verifyEmailMutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Verification Failed
              </h2>
              <p className="text-sm text-gray-600">
                The verification link has expired or is invalid. Please request
                a new verification email.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-none font-medium transition-colors">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-10 border-gray-200 rounded-none font-medium hover:bg-gray-50 transition-colors"
                >
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Need help?{" "}
            <Link
              href="/support"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (verifyEmailMutation.isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Email Verified Successfully!
              </h2>
              <p className="text-sm text-gray-600">
                Your email address has been verified. You can now access all
                features of your account.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/dashboard">
                <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-none font-medium transition-colors ">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full h-10 border-gray-200 rounded-none font-medium hover:bg-gray-50 transition-colors"
                >
                  Go to Homepage
                </Button>
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            Welcome aboard! 🎉
          </p>
        </div>
      </div>
    );
  }

  return null;
}
