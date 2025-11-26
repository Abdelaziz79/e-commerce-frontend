// types/cart.ts (Updated)
import { Product } from "./product";

// Cart item with full variation support
export interface CartItem {
  product: string | Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variation?: {
    size?: string;
    color?: string;
    material?: string;
    style?: string;
    sku?: string;
  };
  // Fields returned from getCart endpoint
  stockStatus?: "available" | "out_of_stock" | "unavailable";
  maxQuantity?: number;
  currentPrice?: number;
  priceChanged?: boolean;
}

export interface AddToCartData {
  productId: string;
  quantity?: number;
  variation?: {
    sku?: string;
  };
}

export interface UpdateCartItemData {
  quantity: number;
  variationSku?: string;
}

// NEW: Cart totals calculation types
export interface TaxDetails {
  rate: number;
  rateName: string;
  taxableAmount: number;
}

export interface ShippingDetails {
  rateName: string;
  type: string;
  originalRate?: number;
  isFree: boolean;
}

export interface DiscountDetails {
  code: string;
  type: string;
  value: number;
  description?: string;
}

export interface CartTotalsBreakdown {
  "Items Total": number;
  Discount?: string;
  "After Discount": number;
  Tax: number;
  Shipping: number;
  "Final Total": number;
}

export interface CartTotalsData {
  itemsPrice: number;
  subtotal: number;
  tax: number;
  taxDetails?: TaxDetails;
  shipping: number;
  shippingDetails?: ShippingDetails;
  discount: number;
  discountDetails?: DiscountDetails;
  total: number;
  breakdown: CartTotalsBreakdown;
  error?: string;
}

export interface CalculateCartTotalsData {
  shippingAddress: {
    address?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  discountCode?: string;
}

// Cart response with proper typing
export interface CartResponse {
  status: string;
  message?: string;
  data: {
    cart: CartItem[];
    activeCart?: CartItem[];
    cartCount: number;
    cartTotal?: number;
    adjustmentsMade?: boolean;
  };
}

export interface CartTotalsResponse {
  status: string;
  data: CartTotalsData;
}
