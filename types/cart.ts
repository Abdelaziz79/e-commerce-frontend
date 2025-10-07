// Cart item with full variation support
export interface CartItem {
  product: string;
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

// Cart payloads
export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  variation?: {
    sku?: string;
  };
}

export interface UpdateCartItemPayload {
  quantity: number;
  variationSku?: string;
}

// Cart response with proper typing
export interface CartResponse {
  status: string;
  message?: string;
  data: {
    cart: CartItem[];
    cartCount: number;
    cartTotal?: number;
  };
}

export interface UpdateCartItemData {
  quantity: number;
  variationSku?: string;
}
