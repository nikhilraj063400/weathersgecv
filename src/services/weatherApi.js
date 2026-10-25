import { API_CONFIG } from '../constants/config';

/**
 * Fetches 7-day forecast, hourly data, and current conditions from Open-Meteo
 */
export async function fetchWeatherData(latitude, longitude, signal) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'is_day',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl'
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_probability_max',
      'precipitation_sum'
    ].join(','),
    forecast_days: '7',
    timezone: 'auto'
  });

  const url = `${API_CONFIG.FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Weather API returned status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.error('[WeatherApi] Failed to fetch forecast:', err);
    throw err;
  }
}
