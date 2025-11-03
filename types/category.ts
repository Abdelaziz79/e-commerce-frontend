// types/category.ts

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string | null;
  subcategories?: Category[]; // For population
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- API PARAMS & PAYLOADS ---
export interface CategoriesParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CategorySearchParams {
  q: string; // Search query (required)
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  [key: string]: string | number | undefined; // Index signature for compatibility
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: File | string; // Support both File upload and URL
  parentCategory?: string | null;
  isActive?: boolean;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

// --- API RESPONSE TYPES ---
export interface PaginatedCategoriesResponse {
  status: string;
  results: number;
  total: number;
  data: {
    categories: Category[];
  };
}

export interface CategoryResponse {
  status: string;
  data: {
    category: Category;
  };
}
