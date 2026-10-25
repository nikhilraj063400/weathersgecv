/**
 * Formatters for weather numbers, dates, and units
 */

export function celsiusToFahrenheit(c) {
  if (c === undefined || c === null) return 0;
  return (c * 9) / 5 + 32;
}

export function kmhToMph(kmh) {
  if (kmh === undefined || kmh === null) return 0;
  return kmh * 0.621371;
}

export function formatTemp(tempC, unit = 'c') {
  if (tempC === undefined || tempC === null) return '--°';
  const val = unit === 'f' ? celsiusToFahrenheit(tempC) : tempC;
  return `${Math.round(val)}°`;
}

export function formatTempRaw(tempC, unit = 'c') {
  if (tempC === undefined || tempC === null) return 0;
  const val = unit === 'f' ? celsiusToFahrenheit(tempC) : tempC;
  return Math.round(val);
}

export function formatWind(speedKmh, unit = 'kmh') {
  if (speedKmh === undefined || speedKmh === null) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmhToMph(speedKmh))} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function formatPressure(hpa) {
  if (!hpa) return '--';
  return `${Math.round(hpa)} hPa`;
}

export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uv) {
  if (uv === undefined || uv === null) return { level: 'Low', color: 'var(--accent-emerald)' };
  if (uv < 3) return { level: 'Low', color: 'var(--accent-emerald)' };
  if (uv < 6) return { level: 'Moderate', color: 'var(--accent-amber)' };
  if (uv < 8) return { level: 'High', color: '#ff9f43' };
  if (uv < 11) return { level: 'Very High', color: 'var(--accent-rose)' };
  return { level: 'Extreme', color: '#ee5253' };
}

/**
 * Format ISO time into hour label (e.g. "3 PM", "12 AM")
 */
export function formatHour(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    // Fallback if parsing string directly like "2026-09-19T03:00"
    const parts = isoString.split('T')[1];
    if (!parts) return isoString;
    const hour = parseInt(parts.split(':')[0], 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h} ${ampm}`;
  }
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

/**
 * Format ISO date string into day label ("Today", "Tomorrow", "Mon", "Tue"...)
 */
export function formatDayName(dateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return dateStr;
}

/**
 * Format sunrise / sunset ISO time string into clean "HH:MM AM/PM"
 */
export function formatSunTime(isoString) {
  if (!isoString) return '--:--';
  const timePart = isoString.includes('T') ? isoString.split('T')[1] : isoString;
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}
