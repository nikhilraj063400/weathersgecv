import { API_CONFIG } from '../constants/config';

/**
 * Searches cities using Open-Meteo Geocoding API with abort signal support
 */
export async function searchCities(query, signal) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();
  const url = `${API_CONFIG.GEO_BASE_URL}?name=${encodeURIComponent(cleanQuery)}&count=10&language=en&format=json`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Geocoding error: ${res.status}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    // Filter duplicates by unique combination of name + admin1 + country + coordinates
    const seen = new Set();
    const formatted = [];

    for (const item of data.results) {
      const key = `${item.name}-${item.admin1 || ''}-${item.country || ''}-${item.latitude.toFixed(2)}-${item.longitude.toFixed(2)}`;
      if (!seen.has(key)) {
        seen.add(key);
        formatted.push({
          id: item.id || Math.random(),
          name: item.name,
          country: item.country || '',
          admin1: item.admin1 || '',
          country_code: item.country_code ? item.country_code.toUpperCase() : '',
          latitude: item.latitude,
          longitude: item.longitude,
          timezone: item.timezone || 'auto',
          population: item.population || 0
        });
      }
    }

    return formatted;
  } catch (err) {
    if (err.name === 'AbortError') {
      return [];
    }
    console.error('[GeoApi] Search failed:', err);
    throw err;
  }
}

/**
 * Reverse geocodes coordinates to a readable city name
 */
export async function reverseGeocode(latitude, longitude, signal) {
  try {
    const url = `${API_CONFIG.REVERSE_GEO_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();

    return {
      name: data.city || data.locality || data.principalSubdivision || 'Current Location',
      country: data.countryName || '',
      admin1: data.principalSubdivision || '',
      country_code: (data.countryCode || '').toUpperCase(),
      latitude,
      longitude,
      timezone: 'auto'
    };
  } catch (err) {
    // Fallback object with coordinates
    return {
      name: 'Current Location',
      country: '',
      admin1: '',
      latitude,
      longitude,
      timezone: 'auto'
    };
  }
}
