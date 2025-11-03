// types/review.ts

export interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    id: string;
  };
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  title?: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  helpfulVotedBy?: string[]; // Array of user IDs who voted
  createdAt: string;
  updatedAt: string;
  id: string;
}

// --- API PARAMS & PAYLOADS ---
export interface ReviewsParams {
  page?: number;
  limit?: number;
  sort?: string;
  product?: string; // Filter reviews by product ID
  [key: string]: string | number | boolean | undefined;
}

export interface CreateReviewData {
  product: string;
  rating: number;
  comment: string;
  title?: string;
  images?: File[];
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  title?: string;
  images?: File[];
}

export interface VoteReviewResponse {
  status: string;
  message: string;
  data: {
    helpfulVotes: number;
    voted: boolean;
  };
}

export interface ProductReviewStats {
  total: number;
  avgRating: number;
  breakdown: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export interface ReviewStatsResponse {
  status: string;
  data: ProductReviewStats;
}

export interface MyReviewsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    reviews: Review[];
  };
}

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
