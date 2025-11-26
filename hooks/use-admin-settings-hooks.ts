// hooks/use-admin-settings-hooks.ts
import { apiClient } from "@/lib/apiClient";
import {
  CreateDiscountCodeData,
  CreateShippingRateData,
  CreateTaxRateData,
  UpdateDiscountCodeData,
  UpdateGeneralSettingsData,
  UpdateShippingRateData,
  UpdateTaxRateData,
  ValidateDiscountCodeData,
} from "@/types/adminSettings";
import { ApiError } from "@/types/auth";
import { CalculateCartTotalsData } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ==================== QUERY KEYS ====================
export const ADMIN_SETTINGS_KEYS = {
  all: ["adminSettings"] as const,
  settings: () => [...ADMIN_SETTINGS_KEYS.all, "settings"] as const,
  public: () => [...ADMIN_SETTINGS_KEYS.all, "public"] as const,
};

// ==================== QUERIES ====================

/**
 * Get all admin settings (Admin only)
 */
export function useAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_KEYS.settings(),
    queryFn: () => apiClient.getAdminSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Get public settings (No auth required)
 */
export function usePublicSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_KEYS.public(),
    queryFn: () => apiClient.getPublicSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// ==================== GENERAL SETTINGS MUTATIONS ====================

/**
 * Update general settings
 */
export function useUpdateGeneralSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGeneralSettingsData) =>
      apiClient.updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("General settings updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update general settings"),
  });
}

// ==================== TAX RATE MUTATIONS ====================

/**
 * Add tax rate
 */
export function useAddTaxRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaxRateData) => apiClient.addTaxRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Tax rate added successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to add tax rate"),
  });
}

/**
 * Update tax rate
 */
export function useUpdateTaxRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taxRateId,
      data,
    }: {
      taxRateId: string;
      data: UpdateTaxRateData;
    }) => apiClient.updateTaxRate(taxRateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Tax rate updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update tax rate"),
  });
}

/**
 * Delete tax rate
 */
export function useDeleteTaxRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taxRateId: string) => apiClient.deleteTaxRate(taxRateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Tax rate deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete tax rate"),
  });
}

/**
 * Toggle tax enabled/disabled
 */
export function useToggleTaxEnabled() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.toggleTaxEnabled(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      const status = response.data.taxEnabled ? "enabled" : "disabled";
      toast.success(`Tax ${status} successfully!`);
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle tax status"),
  });
}

// ==================== SHIPPING RATE MUTATIONS ====================

/**
 * Add shipping rate
 */
export function useAddShippingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShippingRateData) =>
      apiClient.addShippingRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Shipping rate added successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to add shipping rate"),
  });
}

/**
 * Update shipping rate
 */
export function useUpdateShippingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      shippingRateId,
      data,
    }: {
      shippingRateId: string;
      data: UpdateShippingRateData;
    }) => apiClient.updateShippingRate(shippingRateId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Shipping rate updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update shipping rate"),
  });
}

/**
 * Delete shipping rate
 */
export function useDeleteShippingRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shippingRateId: string) =>
      apiClient.deleteShippingRate(shippingRateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Shipping rate deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete shipping rate"),
  });
}

/**
 * Toggle shipping enabled/disabled
 */
export function useToggleShippingEnabled() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.toggleShippingEnabled(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      const status = response.data.shippingEnabled ? "enabled" : "disabled";
      toast.success(`Shipping ${status} successfully!`);
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle shipping status"),
  });
}

// ==================== DISCOUNT CODE MUTATIONS ====================

/**
 * Add discount code
 */
export function useAddDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDiscountCodeData) =>
      apiClient.addDiscountCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Discount code added successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to add discount code"),
  });
}

/**
 * Update discount code
 */
export function useUpdateDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      discountCodeId,
      data,
    }: {
      discountCodeId: string;
      data: UpdateDiscountCodeData;
    }) => apiClient.updateDiscountCode(discountCodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Discount code updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update discount code"),
  });
}

/**
 * Delete discount code
 */
export function useDeleteDiscountCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountCodeId: string) =>
      apiClient.deleteDiscountCode(discountCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_SETTINGS_KEYS.all });
      toast.success("Discount code deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete discount code"),
  });
}

/**
 * Validate discount code (User)
 * Note: This doesn't invalidate cache as it's a read-only validation
 */
export function useValidateDiscountCode() {
  return useMutation({
    mutationFn: (data: ValidateDiscountCodeData) =>
      apiClient.validateDiscountCode(data),
    onError: (error: ApiError) =>
      toast.error(error.message || "Invalid discount code"),
  });
}
