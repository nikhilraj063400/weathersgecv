/**
 * App Configuration & Default Constants
 */
export const API_CONFIG = {
  GEO_BASE_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST_BASE_URL: 'https://api.open-meteo.com/v1/forecast',
  REVERSE_GEO_URL: 'https://api.bigdatacloud.net/data/reverse-geocode-client'
};

export const STORAGE_KEYS = {
  USER_NAME: 'aetheria_user_name',
  LAST_CITY: 'aetheria_last_city',
  TEMP_UNIT: 'aetheria_temp_unit', // 'c' | 'f'
  WIND_UNIT: 'aetheria_wind_unit', // 'kmh' | 'mph'
  FAVORITES: 'aetheria_favorites'
};

export const DEFAULT_CITY = {
  id: 1850147,
  name: 'Tokyo',
  country: 'Japan',
  admin1: 'Tokyo',
  latitude: 35.6895,
  longitude: 139.6917,
  timezone: 'Asia/Tokyo'
};

export const TIME_PHASES = {
  DAWN: 'dawn',
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  GOLDEN: 'golden',
  DUSK: 'dusk',
  NIGHT: 'night'
};
