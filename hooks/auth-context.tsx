// hooks/auth-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Query keys for React Query sync
const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  token: ["auth", "token"] as const,
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get query client for syncing with React Query cache
  const queryClient = useQueryClient();

  // Initialize auth state from localStorage (FIXED: SSR-safe)
  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);

        // Sync with React Query cache
        queryClient.setQueryData(AUTH_KEYS.user, userData);
        queryClient.setQueryData(AUTH_KEYS.token, storedToken);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // Clear invalid data
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", userToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }

    // Sync with React Query cache for devtools visibility
    queryClient.setQueryData(AUTH_KEYS.user, userData);
    queryClient.setQueryData(AUTH_KEYS.token, userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }

    // Clear React Query cache
    queryClient.removeQueries({ queryKey: AUTH_KEYS.user });
    queryClient.removeQueries({ queryKey: AUTH_KEYS.token });
  };

  const updateUser = (userData: User) => {
    setUser(userData);

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(userData));
    }

    // Sync with React Query cache
    queryClient.setQueryData(AUTH_KEYS.user, userData);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
