/**
 * Open-Meteo Air Quality API Service
 * Completely free, no API key required
 */

export async function fetchAirQuality(latitude, longitude, signal) {
  if (latitude === undefined || longitude === undefined) return null;

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`;

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) {
      throw new Error(`Air Quality API error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('[AirQualityApi] Failed to fetch AQI data:', err);
    return null;
  }
}

/**
 * Returns category info for US AQI scale
 */
export function getAqiCategory(aqi) {
  if (aqi === undefined || aqi === null) {
    return { label: 'Unknown', color: 'var(--text-dim)', bg: 'rgba(255,255,255,0.1)', advice: 'No air quality data available.' };
  }

  if (aqi <= 50) {
    return {
      label: 'Good',
      color: '#55efc4',
      bg: 'rgba(85, 239, 196, 0.18)',
      advice: 'Air quality is satisfactory and poses little or no risk.'
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: '#ffd166',
      bg: 'rgba(255, 209, 102, 0.18)',
      advice: 'Air quality is acceptable; very sensitive people should limit prolonged exposure.'
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Sensitive',
      color: '#ff9f43',
      bg: 'rgba(255, 159, 67, 0.18)',
      advice: 'Members of sensitive groups may experience health effects. General public less affected.'
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy',
      color: '#ff7675',
      bg: 'rgba(255, 118, 117, 0.22)',
      advice: 'Everyone may begin to experience health effects; sensitive groups more serious effects.'
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: '#a29bfe',
      bg: 'rgba(162, 155, 254, 0.22)',
      advice: 'Health alert: the risk of health effects is increased for everyone.'
    };
  }
  return {
    label: 'Hazardous',
    color: '#e056fd',
    bg: 'rgba(224, 86, 253, 0.25)',
    advice: 'Health warnings of emergency conditions. Entire population is likely affected.'
  };
}
