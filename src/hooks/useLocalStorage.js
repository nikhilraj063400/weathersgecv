import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

/**
 * Custom hook to synchronize state with localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storage.get(key, initialValue);
  });

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      storage.set(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}
