// types/user.ts
export interface Address {
  _id?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CartItem {
  product: string;
  quantity: number;
  price: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  phone?: string;
  cart: CartItem[];
  addresses: Address[];
  favorites: string[];
  orderHistory: string[];
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AddAddressData {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressData {
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

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
