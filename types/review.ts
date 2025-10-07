// types/review.ts

export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  title?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

// --- API PARAMS & PAYLOADS ---
export interface ReviewsParams {
  page?: number;
  limit?: number;
  sort?: string;
  product?: string; // Filter reviews by product ID
}

export interface CreateReviewData {
  product: string;
  rating: number;
  comment: string;
  title?: string;
  images?: string[];
}

export type UpdateReviewData = Partial<Omit<CreateReviewData, "product">>;

// --- API RESPONSE TYPES ---
export interface PaginatedReviewsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    reviews: Review[];
  };
}

export interface ReviewResponse {
  status: string;
  data: {
    review: Review;
  };
}
