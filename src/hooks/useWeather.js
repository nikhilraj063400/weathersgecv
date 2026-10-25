import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchWeatherData } from '../services/weatherApi';
import { fetchAirQuality } from '../services/airQualityApi';
import { storage } from '../utils/storage';

const WEATHER_CACHE_KEY = 'aetheria_cached_weather';

/**
 * Hook to manage weather data fetching, offline caching, and error handling
 */
export function useWeather(city) {
  const [weather, setWeather] = useState(() => {
    // Attempt to load last cached weather
    return storage.get(WEATHER_CACHE_KEY, null);
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortControllerRef = useRef(null);

  const loadWeather = useCallback(async () => {
    if (!city || city.latitude === undefined || city.longitude === undefined) {
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const [weatherRes, aqiRes] = await Promise.allSettled([
        fetchWeatherData(city.latitude, city.longitude, controller.signal),
        fetchAirQuality(city.latitude, city.longitude, controller.signal)
      ]);

      if (weatherRes.status === 'fulfilled') {
        const data = weatherRes.value;
        if (aqiRes.status === 'fulfilled' && aqiRes.value) {
          data.airQuality = aqiRes.value.current;
        }
        setWeather(data);
        setLastUpdated(new Date());
        setIsLoading(false);
        storage.set(WEATHER_CACHE_KEY, data);
      } else {
        throw weatherRes.reason;
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('[useWeather] Fetch error:', err);
        setError(!navigator.onLine ? 'You are offline. Showing cached forecast.' : 'Failed to load weather. Please try again.');
        setIsLoading(false);
      }
    }
  }, [city]);

  useEffect(() => {
    loadWeather();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadWeather]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      loadWeather();
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [loadWeather]);

  return {
    weather,
    isLoading,
    error,
    refetch: loadWeather,
    lastUpdated
  };
}
