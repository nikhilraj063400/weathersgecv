import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants/config';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userName, setUserName] = useLocalStorage(STORAGE_KEYS.USER_NAME, '');
  const [tempUnit, setTempUnit] = useLocalStorage(STORAGE_KEYS.TEMP_UNIT, 'c');
  const [windUnit, setWindUnit] = useLocalStorage(STORAGE_KEYS.WIND_UNIT, 'kmh');
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);

  // Show welcome modal if user has no saved name on first load
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  useEffect(() => {
    if (!userName || userName.trim().length === 0) {
      setIsNameModalOpen(true);
    }
  }, [userName]);

  const toggleTempUnit = () => {
    setTempUnit((prev) => (prev === 'c' ? 'f' : 'c'));
  };

  const toggleWindUnit = () => {
    setWindUnit((prev) => (prev === 'kmh' ? 'mph' : 'kmh'));
  };

  const addFavorite = (city) => {
    if (!city) return;
    setFavorites((prev) => {
      const exists = prev.some((c) => c.latitude === city.latitude && c.longitude === city.longitude);
      if (exists) return prev;
      return [city, ...prev].slice(0, 8); // Keep up to 8 favorites
    });
  };

  const removeFavorite = (city) => {
    if (!city) return;
    setFavorites((prev) => prev.filter((c) => !(c.latitude === city.latitude && c.longitude === city.longitude)));
  };

  const isFavorite = (city) => {
    if (!city) return false;
    return favorites.some((c) => c.latitude === city.latitude && c.longitude === city.longitude);
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        isNameModalOpen,
        setIsNameModalOpen,
        tempUnit,
        setTempUnit,
        toggleTempUnit,
        windUnit,
        setWindUnit,
        toggleWindUnit,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
