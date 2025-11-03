// types/user.ts

import { CartItem } from "./cart";
import { FavoriteProduct } from "./favorite";
import { OrderHistoryReference } from "./order";

export interface AvatarUploadResponse {
  status: string;
  message: string;
  data: {
    avatar: string;
  };
}

export interface AvatarDeleteResponse {
  status: string;
  message: string;
  data: {
    avatar: string;
  };
}
export interface Address {
  _id?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string; // Add this field
  isEmailVerified: boolean;
  phone?: string;
  cart: CartItem[];
  addresses: Address[];
  favorites: FavoriteProduct[];
  orderHistory: OrderHistoryReference[];
  createdAt: string;
}

// --- API Payloads ---
export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export type AddAddressData = Omit<Address, "_id">;

export type UpdateAddressData = Partial<AddAddressData>;

// --- API Responses ---
export interface UserProfileResponse {
  status: string;
  data: UserProfile;
}

export interface UserUpdateResponse {
  status: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar: string; // Add this field
    isEmailVerified: boolean;
    phone?: string;
    token: string;
  };
}

export interface AddressResponse {
  status: string;
  data: {
    addresses: Address[];
  };
}

export interface PasswordUpdateResponse {
  status: string;
  message: string;
}
