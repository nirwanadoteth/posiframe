/**
 * Storage abstraction following Dependency Inversion Principle.
 * Decouples application from direct localStorage dependency.
 * Can be swapped for IndexedDB, AsyncStorage, or test mocks.
 */
export const storage = {
  /**
   * Retrieves an item from storage.
   * Returns null if item doesn't exist or storage is unavailable.
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      // Storage may throw in private browsing mode
      return null;
    }
  },

  /**
   * Stores an item in storage.
   * Returns true if successful, false if storage is unavailable.
   */
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      // Storage may throw in private browsing mode or quota exceeded
      return false;
    }
  },

  /**
   * Removes an item from storage.
   * Silently fails if storage is unavailable.
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage may throw in private browsing mode
    }
  },
};
