import { Product } from "./product";

export interface FavoriteProduct {
  product: string;
  addedAt: string;
}

export interface FavoriteItem {
  product: string;
  addedAt: string;
}

export interface FavoritesData {
  favorites: FavoriteItem[];
  favoritesCount: number;
}

export interface AddToFavoritesResponse {
  status: string;
  message: string;
  data: FavoritesData;
}

export interface RemoveFromFavoritesResponse {
  status: string;
  message: string;
  data: FavoritesData;
}

export interface FavoritesResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  data: {
    favorites: Product[]; // Full product objects when fetched
  };
}
