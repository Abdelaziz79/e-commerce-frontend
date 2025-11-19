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
  helpfulVotedBy?: string[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ReviewsParams {
  page?: number;
  limit?: number;
  sort?: string;
  product?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface CreateReviewData {
  product: string;
  rating: number;
  comment: string;
  title?: string;
  images?: File[];
}

// FIXED: Added existingImages field
export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  title?: string;
  images?: File[]; // New images to upload
  existingImages?: string[]; // Existing images to keep
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
  stats?: {
    totalReviews: number;
    avgRating: number;
    totalHelpfulVotes: number;
    verifiedCount: number;
    ratingBreakdown: Record<number, number>;
  };
}

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
