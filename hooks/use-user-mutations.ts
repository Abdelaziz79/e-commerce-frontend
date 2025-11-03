// hooks/use-user-mutations.ts
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";
import {
  AddAddressData,
  UpdateAddressData,
  UpdatePasswordData,
  UpdateProfileData,
  UserProfileResponse,
} from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

// Query keys
export const USER_KEYS = {
  profile: ["user", "profile"] as const,
  addresses: ["user", "addresses"] as const,
} as const;

// ============ QUERIES ============

/**
 * Hook to fetch user profile
 */
export function useUserProfile() {
  const { token } = useAuth();

  return useQuery({
    queryKey: USER_KEYS.profile,
    queryFn: () => apiClient.getUserProfile(),
    enabled: !!token, // Only run if user is authenticated
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors
      if (error instanceof Error && "status" in error) {
        const apiError = error as ApiError;
        if (apiError.status === 401 || apiError.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

// ============ MUTATIONS ============

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => apiClient.updateUserProfile(data),
    onSuccess: (response) => {
      // Update auth context with new user data
      const { ...userData } = response.data;
      updateUser(userData);

      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update profile");
      }
    },
  });
}

/**
 * Hook to update user password
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: UpdatePasswordData) =>
      apiClient.updateUserPassword(data),
    onSuccess: (response) => {
      toast.success(response.message || "Password updated successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update password");
      }
    },
  });
}

// ============ AVATAR MUTATIONS ============

/**
 * Hook to upload/update user avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { updateUser, user } = useAuth();

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadAvatar(file),
    onMutate: () => {
      toast.loading("Uploading avatar...", { id: "avatar-upload" });
    },
    onSuccess: (response) => {
      toast.dismiss("avatar-upload");

      // Update auth context with new avatar
      if (user) {
        updateUser({ ...user, avatar: response.data.avatar });
      }

      // Update React Query cache
      queryClient.setQueryData(
        USER_KEYS.profile,
        (oldData: UserProfileResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                avatar: response.data.avatar,
              },
            };
          }
          return oldData;
        }
      );

      // Invalidate profile query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success(response.message || "Avatar uploaded successfully!");
    },
    onError: (error: ApiError) => {
      toast.dismiss("avatar-upload");
      toast.error(error.message || "Failed to upload avatar");
    },
  });
}

/**
 * Hook to delete user avatar (reset to default)
 */
export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  const { updateUser, user } = useAuth();

  return useMutation({
    mutationFn: () => apiClient.deleteAvatar(),
    onMutate: () => {
      toast.loading("Deleting avatar...", { id: "avatar-delete" });
    },
    onSuccess: (response) => {
      toast.dismiss("avatar-delete");

      // Update auth context with default avatar
      if (user) {
        updateUser({ ...user, avatar: response.data.avatar });
      }

      // Update React Query cache
      queryClient.setQueryData(
        USER_KEYS.profile,
        (oldData: UserProfileResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                avatar: response.data.avatar,
              },
            };
          }
          return oldData;
        }
      );

      // Invalidate profile query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success(response.message || "Avatar deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.dismiss("avatar-delete");
      toast.error(error.message || "Failed to delete avatar");
    },
  });
}

// ============ ADDRESS MUTATIONS ============

/**
 * Hook to add user address
 */
export function useAddAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddAddressData) => apiClient.addUserAddress(data),
    onSuccess: (response) => {
      // Update the profile cache with new addresses
      queryClient.setQueryData(
        USER_KEYS.profile,
        (oldData: UserProfileResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                addresses: response.data.addresses,
              },
            };
          }
          return oldData;
        }
      );

      // Invalidate profile query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success("Address added successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to add address");
      }
    },
  });
}

/**
 * Hook to update user address
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      data,
    }: {
      addressId: string;
      data: UpdateAddressData;
    }) => apiClient.updateUserAddress(addressId, data),
    onSuccess: (response) => {
      // Update the profile cache with updated addresses
      queryClient.setQueryData(
        USER_KEYS.profile,
        (oldData: UserProfileResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                addresses: response.data.addresses,
              },
            };
          }
          return oldData;
        }
      );

      // Invalidate profile query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success("Address updated successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update address");
      }
    },
  });
}

/**
 * Hook to delete user address
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => apiClient.deleteUserAddress(addressId),
    onSuccess: (response) => {
      // Update the profile cache with remaining addresses
      queryClient.setQueryData(
        USER_KEYS.profile,
        (oldData: UserProfileResponse | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                addresses: response.data.addresses,
              },
            };
          }
          return oldData;
        }
      );

      // Invalidate profile query to ensure fresh data
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile });

      toast.success("Address deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete address");
    },
  });
}

// ============ UTILITY HOOKS ============

/**
 * Hook to get user addresses from profile
 */
export function useUserAddresses() {
  const { data: profileData, isLoading, error } = useUserProfile();

  return {
    addresses: profileData?.data?.addresses || [],
    isLoading,
    error,
  };
}

/**
 * Hook to get default address
 */
export function useDefaultAddress() {
  const { addresses } = useUserAddresses();

  return addresses.find((address) => address.isDefault) || null;
}

/**
 * Hook to get user avatar URL
 */
export function useUserAvatar() {
  const { data: profileData } = useUserProfile();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_IMAGE_HOST_URL || "http://localhost:5000";

  const avatar =
    profileData?.data?.avatar || "/uploads/avatars/default-avatar.png";

  // Return full URL if avatar is a relative path
  if (avatar.startsWith("/")) {
    return `${apiBaseUrl}${avatar}`;
  }

  return avatar;
}
