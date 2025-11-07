import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageSrc = (path?: string): string => {
  if (!path) return "/placeholder.svg";

  // If it's already a full URL (starts with http:// or https://), return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Otherwise, it's a local path - prepend the API base URL
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
