// app/forgot-password/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/use-auth-mutations";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Check your email
              </h2>
              <p className="text-sm text-gray-600">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-sm font-medium text-gray-900">{email}</p>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 p-4 space-y-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                Click the link in the email to reset your password. The link
                will expire in 1 hour.
              </p>
              <p className="text-xs text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-gray-900 hover:underline"
                >
                  try again
                </button>
              </p>
            </div>

            {/* Back to Sign In */}
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 shadow-sm p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="h-6 w-6 text-gray-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>
            <p className="text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-gray-200 rounded-none focus-visible:ring-gray-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-none font-medium transition-colors"
            >
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {/* Back to Sign In */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/sign-in"
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Need help? Contact our{" "}
          <Link
            href="/support"
            className="font-medium text-gray-700 hover:text-gray-900"
          >
            support team
          </Link>
        </p>
      </div>
    </div>
  );
}
