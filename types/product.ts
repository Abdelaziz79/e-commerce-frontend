// types/product.ts

import { Brand } from "./brand";
import { Category } from "./category";
import { Review } from "./review";

// --- SUB-DOCUMENTS ---

export interface ProductVariation {
  _id?: string;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  sku: string;
  price: number;
  countInStock: number;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "inch" | "mm" | "m";
}

// --- MAIN PRODUCT DOCUMENT ---

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  richDescription?: string;
  price: number;
  images: string[];
  mainImage: string;
  // References are now objects when populated
  category: Category | string;
  brand: Brand | string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews?: Review[]; // Populated via virtual field
  hasVariations?: boolean;
  variations?: ProductVariation[];
  featured: boolean;
  isNewProduct?: boolean;
  onSale: boolean;
  salePrice?: number;
  saleEndDate?: string;
  tags?: string[];
  dimensions?: ProductDimensions;
  weight?: number;
  weightUnit?: "kg" | "g" | "lb" | "oz";
  relatedProducts?: string[];
  warranty?: string;
  attributes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// --- API PARAMS & PAYLOADS ---

export interface ProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  category?: string; // This will be the category ID
  brand?: string; // This will be the brand ID
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  onSale?: boolean;
  inStock?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface SearchProductsParams {
  q: string;
  limit?: number;
  page?: number;
  [key: string]: string | number | undefined;
}

export interface LowStockParams {
  threshold?: number;
  [key: string]: string | number | undefined;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string; // ID of the category
  brand: string; // ID of the brand
  countInStock?: number;
  images?: File[] | string[]; // Support both File upload and URLs
  mainImage?: File | string;
  richDescription?: string;
  hasVariations?: boolean;
  variations?: ProductVariation[];
  featured?: boolean;
  isNewProduct?: boolean;
  onSale?: boolean;
  salePrice?: number;
  saleEndDate?: string;
  tags?: string[];
  dimensions?: ProductDimensions;
  weight?: number;
  weightUnit?: "kg" | "g" | "lb" | "oz";
  relatedProducts?: string[];
  warranty?: string;
  attributes?: Record<string, string>;
}

export type UpdateProductData = Partial<CreateProductData>;

// --- BULK OPERATIONS ---

export interface BulkUpdateData {
  productIds: string[];
  updates: Partial<Product>;
}

export interface BulkDeleteData {
  productIds: string[];
}

export interface BulkOperationResponse {
  status: string;
  message: string;
  data?: {
    modifiedCount?: number;
    deletedCount?: number;
  };
}

// --- STOCK MANAGEMENT ---

export interface StockAdjustmentData {
  adjustment: number;
  reason?: string;
}

// --- PRODUCT STATISTICS ---

export interface ProductStats {
  totalProducts: Array<{ count: number }>;
  totalValue: Array<{ _id: null; total: number }>;
  averagePrice: Array<{ _id: null; avg: number }>;
  outOfStock: Array<{ count: number }>;
  featured: Array<{ count: number }>;
  onSale: Array<{ count: number }>;
  byCategory: Array<{
    _id: string;
    count: number;
    categoryInfo: Category[];
  }>;
  byBrand: Array<{
    _id: string;
    count: number;
    brandInfo: Brand[];
  }>;
}

export interface ProductStatsResponse {
  status: string;
  data: ProductStats;
}

// --- API RESPONSE TYPES ---

export interface PaginatedProductsResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  data: Product[];
}

export interface ProductResponse {
  status: string;
  data: Product;
  message?: string;
}

export interface ProductListResponse {
  status: string;
  results: number;
  data: Product[];
}
