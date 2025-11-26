// types/adminSettings.ts

// ==================== TAX RATE TYPES ====================
export interface TaxRate {
  _id: string;
  name: string;
  rate: number;
  description?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCodes?: string[];
  isDefault: boolean;
  isActive: boolean;
  priority: number;
}

export interface CreateTaxRateData {
  name: string;
  rate: number;
  description?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCodes?: string[];
  isDefault?: boolean;
  isActive?: boolean;
  priority?: number;
}

export type UpdateTaxRateData = Partial<CreateTaxRateData>;

// ==================== SHIPPING RATE TYPES ====================
export interface WeightRange {
  minWeight: number;
  maxWeight: number;
  rate: number;
}

export interface PriceRange {
  minPrice: number;
  maxPrice: number;
  rate: number;
}

export interface ShippingRate {
  _id: string;
  name: string;
  description?: string;
  type: "flat" | "weight-based" | "price-based";
  flatRate?: number;
  freeShippingThreshold?: number;
  weightRanges?: WeightRange[];
  priceRanges?: PriceRange[];
  isActive: boolean;
}

export interface CreateShippingRateData {
  name: string;
  description?: string;
  type: "flat" | "weight-based" | "price-based";
  flatRate?: number;
  freeShippingThreshold?: number;
  weightRanges?: WeightRange[];
  priceRanges?: PriceRange[];
  isActive?: boolean;
}

export type UpdateShippingRateData = Partial<CreateShippingRateData>;

// ==================== DISCOUNT CODE TYPES ====================
export interface DiscountCodeUsage {
  user: string;
  usedCount: number;
  lastUsed: string;
}

export interface DiscountCode {
  _id: string;
  code: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: string;
  validUntil: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedCategories?: string[];
  excludedProducts?: string[];
  isActive: boolean;
  usedBy: DiscountCodeUsage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountCodeData {
  code: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  validFrom: string;
  validUntil: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  excludedCategories?: string[];
  excludedProducts?: string[];
  isActive?: boolean;
}

export type UpdateDiscountCodeData = Partial<CreateDiscountCodeData>;

export interface ValidateDiscountCodeData {
  code: string;
  orderAmount: number;
  products: string[];
  categories: string[];
}

export interface ValidatedDiscountResponse {
  status: string;
  data: {
    code: string;
    type: "percentage" | "fixed";
    value: number;
    discountAmount: number;
    description?: string;
  };
}

// ==================== ADMIN SETTINGS TYPES ====================
export interface AdminSettings {
  _id: string;
  // Tax settings
  taxRates: TaxRate[];
  taxEnabled: boolean;
  pricesIncludeTax: boolean;

  // Shipping settings
  shippingRates: ShippingRate[];
  shippingEnabled: boolean;
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;

  // Discount codes
  discountCodes: DiscountCode[];

  // General settings
  storeName: string;
  storeEmail?: string;
  storeCurrency: string;
  storeTimezone: string;

  // Order settings
  orderPrefix: string;
  minimumOrderAmount: number;
  maximumOrderAmount?: number;
  allowGuestCheckout: boolean;

  // Notification settings
  orderNotificationEmail?: string;
  sendOrderConfirmation: boolean;
  sendShippingNotification: boolean;

  // Maintenance mode
  maintenanceMode: boolean;
  maintenanceMessage: string;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateGeneralSettingsData {
  storeName?: string;
  storeEmail?: string;
  storeCurrency?: string;
  storeTimezone?: string;
  orderPrefix?: string;
  minimumOrderAmount?: number;
  maximumOrderAmount?: number;
  allowGuestCheckout?: boolean;
  orderNotificationEmail?: string;
  sendOrderConfirmation?: boolean;
  sendShippingNotification?: boolean;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

export interface PublicSettings {
  taxEnabled: boolean;
  taxRates: TaxRate[];
  shippingEnabled: boolean;
  shippingRates: ShippingRate[];
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  storeCurrency: string;
  minimumOrderAmount: number;
}

// ==================== API RESPONSE TYPES ====================
export interface AdminSettingsResponse {
  status: string;
  data: AdminSettings;
}

export interface PublicSettingsResponse {
  status: string;
  data: PublicSettings;
}

export interface TaxRateResponse {
  status: string;
  message: string;
  data: TaxRate;
}

export interface ShippingRateResponse {
  status: string;
  message: string;
  data: ShippingRate;
}

export interface DiscountCodeResponse {
  status: string;
  message: string;
  data: DiscountCode;
}

export interface ToggleResponse {
  status: string;
  message: string;
  data: {
    taxEnabled?: boolean;
    shippingEnabled?: boolean;
  };
}

export interface MessageResponse {
  status: string;
  message: string;
}
