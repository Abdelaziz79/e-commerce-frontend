// hooks/use-auth-mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "./auth-context";
import {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ApiError,
} from "@/types/auth";

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => apiClient.login(credentials),
    onSuccess: (data) => {
      login(data.data, data.data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      // Handle validation errors with individual field messages
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Login failed");
      }
    },
  });
}

export function useRegister() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (userData: RegisterData) => apiClient.register(userData),
    onSuccess: (data) => {
      login(data.data, data.data.token);
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      // Handle validation errors with individual field messages
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Registration failed");
      }
    },
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // If you have a logout endpoint on your backend, call it here
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: () => {
      // Force logout even if API call fails
      logout();
      queryClient.clear();
      router.push("/");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => apiClient.forgotPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset email sent successfully");
    },
    onError: (error: ApiError) => {
      // Handle validation errors
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to send password reset email");
      }
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: ResetPasswordData }) =>
      apiClient.resetPassword(token, data),
    onSuccess: () => {
      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
      router.push("/sign-in");
    },
    onError: (error: ApiError) => {
      // Handle validation errors
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to reset password");
      }
    },
  });
}

export function useVerifyEmail() {
  const { updateUser, user } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (token: string) => apiClient.verifyEmail(token),
    onSuccess: () => {
      if (user) {
        updateUser({ ...user, isEmailVerified: true });
      }
      toast.success("Email verified successfully!");
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Email verification failed");
    },
  });
}
