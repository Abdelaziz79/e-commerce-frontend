// ==================== TOKEN STORAGE ====================
const TOKEN_KEY = "auth_token";

export class TokenStorage {
  private static instance: TokenStorage;
  private tokenKey = TOKEN_KEY;

  private constructor() {}

  static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }

  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return null;
    }
  }

  set(token: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  }

  remove(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }
}
