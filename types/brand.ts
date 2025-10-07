// types/brand.ts

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// --- API PARAMS & PAYLOADS ---
export interface BrandsParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateBrandData {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}

export type UpdateBrandData = Partial<CreateBrandData>;

// --- API RESPONSE TYPES ---
export interface PaginatedBrandsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    brands: Brand[];
  };
}

export interface BrandResponse {
  status: string;
  data: {
    brand: Brand;
  };
}
