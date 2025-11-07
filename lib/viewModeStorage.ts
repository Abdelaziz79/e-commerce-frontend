// utils/viewModeStorage.ts

import { ViewMode } from "@/components/products/ViewModeToggle";

const VIEW_MODE_KEY = "product_view_mode";

export class ViewModeStorage {
  private static instance: ViewModeStorage;
  private viewModeKey = VIEW_MODE_KEY;

  private constructor() {}

  static getInstance(): ViewModeStorage {
    if (!ViewModeStorage.instance) {
      ViewModeStorage.instance = new ViewModeStorage();
    }
    return ViewModeStorage.instance;
  }

  get(): ViewMode {
    if (typeof window === "undefined") return "grid-3";
    try {
      const saved = localStorage.getItem(this.viewModeKey);
      if (saved && ["grid-3", "grid-4", "list"].includes(saved)) {
        return saved as ViewMode;
      }
      return "grid-3";
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return "grid-3";
    }
  }

  set(mode: ViewMode): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.viewModeKey, mode);
    } catch (error) {
      console.error("Failed to store view mode:", error);
    }
  }
}
