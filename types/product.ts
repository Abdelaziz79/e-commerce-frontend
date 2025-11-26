import { Brand } from "./brand";
import { Category } from "./category";
import { Review } from "./review";

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
  category: Category | string;
  brand: Brand | string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews?: Review[];
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
  relatedProducts?: Product[];
  warranty?: string;
  attributes?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// --- LOW STOCK TYPES ---

export interface StockSummary {
  mainStock: number;
  mainStockStatus: "low" | "ok";
  hasLowVariations: boolean;
  lowVariationCount: number;
  totalVariations: number;
  affectedVariations: ProductVariation[];
}

export interface LowStockProduct extends Product {
  stockSummary: StockSummary;
  lowStockVariations?: ProductVariation[];
  mainProductLowStock: boolean;
  hasLowVariations: boolean;
}

export interface LowStockListResponse {
  status: string;
  results: number;
  threshold: number;
  data: LowStockProduct[];
}

export interface LowStockByCategory {
  _id: string;
  count: number;
  products: Array<{
    id: string;
    name: string;
    mainStock: number;
    hasLowVariations: boolean;
  }>;
}

export interface CriticalItem {
  _id: string;
  name: string;
  mainStock: number;
  lowStockVariations: ProductVariation[];
}

export interface OutOfStockSummary {
  mainStock: number;
  mainStockStatus: "out_of_stock" | "in_stock";
  hasOutOfStockVariations: boolean;
  outOfStockVariationCount: number;
  inStockVariationCount: number;
  totalVariations: number;
  affectedVariations: ProductVariation[];
  isCompletelyOutOfStock: boolean;
}

export interface OutOfStockProduct extends Product {
  stockSummary: OutOfStockSummary;
  outOfStockVariations?: ProductVariation[];
  mainProductOutOfStock: boolean;
  hasOutOfStockVariations: boolean;
  outOfStockVariationCount: number;
}

export interface OutOfStockListResponse {
  status: string;
  results: number;
  data: OutOfStockProduct[];
}

export interface OutOfStockParams {
  includeVariations?: boolean;
  [key: string]: string | number | boolean | undefined;
}
// --- API PARAMS & PAYLOADS ---

export interface ProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  category?: string;
  brand?: string;
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
  includeVariations?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock?: number;
  images?: File[] | string[];
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
