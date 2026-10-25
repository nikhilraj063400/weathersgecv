import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, DEFAULT_CITY } from '../constants/config';
import { reverseGeocode } from '../services/geoApi';

const CityContext = createContext();

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCityInternal] = useLocalStorage(STORAGE_KEYS.LAST_CITY, DEFAULT_CITY);
  const [recentCities, setRecentCities] = useLocalStorage('aetheria_recent_cities', [
    DEFAULT_CITY,
    { id: 2643743, name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257, timezone: 'Europe/London' },
    { id: 5128581, name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7143, longitude: -74.006, timezone: 'America/New_York' },
    { id: 2988507, name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' }
  ]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const selectCity = useCallback((city) => {
    if (!city) return;
    setSelectedCityInternal(city);

    setRecentCities((prev) => {
      const filtered = prev.filter((c) => c.latitude !== city.latitude || c.longitude !== city.longitude);
      return [city, ...filtered].slice(0, 5);
    });
  }, [setSelectedCityInternal, setRecentCities]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          selectCity({
            id: 'geo-' + Date.now(),
            name: locationData.name,
            admin1: locationData.admin1,
            country: locationData.country,
            country_code: locationData.country_code,
            latitude,
            longitude,
            timezone: 'auto'
          });
        } catch (err) {
          console.error('[CityContext] Geolocation reverse failed:', err);
          setLocationError('Could not determine city name from location.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('[CityContext] Geolocation denied or failed:', err);
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Location access was denied. Search for your city above.');
        } else {
          setLocationError('Location request timed out. Please try searching.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [selectCity]);

  return (
    <CityContext.Provider
      value={{
        selectedCity: selectedCity || DEFAULT_CITY,
        setSelectedCity: selectCity,
        recentCities,
        useCurrentLocation,
        isLocating,
        locationError
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
