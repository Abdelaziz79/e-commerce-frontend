// utils/brandViewModeStorage.ts

type ViewMode = "grid" | "list";

const VIEW_MODE_KEY = "brand_view_mode";

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
    if (typeof window === "undefined") return "grid";
    try {
      const saved = localStorage.getItem(this.viewModeKey);
      if (saved && ["grid", "list"].includes(saved)) {
        return saved as ViewMode;
      }
      return "grid";
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return "grid";
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
