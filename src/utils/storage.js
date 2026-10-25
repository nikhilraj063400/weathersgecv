/**
 * Safe localStorage wrapper with try/catch fallbacks for privacy modes or quota issues
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key}:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to write ${key}:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to remove ${key}:`, e);
      return false;
    }
  }
};
