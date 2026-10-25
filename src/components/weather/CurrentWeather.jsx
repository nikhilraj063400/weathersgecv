import React, { useMemo } from 'react';
import { Heart, ArrowUp, ArrowDown, Clock, Wind, Droplets, Sun, Navigation2, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp, formatWind, getWindDirection, getUvCategory } from '../../utils/format';
import { getTimeOfDayGreeting } from '../../utils/timePhase';
import { getAqiCategory } from '../../services/airQualityApi';
import { useUser } from '../../context/UserContext';
import { useCity } from '../../context/CityContext';
import './CurrentWeather.css';

export function CurrentWeather({ current, daily, timePhase, airQuality, timezone }) {
  const { userName, tempUnit, windUnit, isFavorite, addFavorite, removeFavorite } = useUser();
  const { selectedCity } = useCity();

  if (!current || !daily) return null;

  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
  const greeting = getTimeOfDayGreeting(timePhase, current.time);
  const greetingText = userName ? `${greeting}, ${userName}` : `${greeting}!`;

  const favorite = isFavorite(selectedCity);
  const toggleFav = () => {
    if (favorite) {
      removeFavorite(selectedCity);
    } else {
      addFavorite(selectedCity);
    }
  };

  const highTemp = daily.temperature_2m_max?.[0];
  const lowTemp = daily.temperature_2m_min?.[0];
  const rainChance = daily.precipitation_probability_max?.[0] || 0;
  const uvMax = daily.uv_index_max?.[0] || 0;
  const uvCategory = getUvCategory(uvMax);
  const windDir = getWindDirection(current.wind_direction_10m);

  // AQI Info
  const aqiVal = airQuality?.us_aqi;
  const aqiInfo = getAqiCategory(aqiVal);

  // Format local city time string (e.g. "Sat, 19 Sep • 12:45 AM")
  const localTimeString = useMemo(() => {
    if (!current.time) return '';
    try {
      const date = new Date(current.time);
      if (!isNaN(date.getTime())) {
        const datePart = date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
        const timePart = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${datePart} • ${timePart}`;
      }
    } catch (e) {
      // ignore
    }
    return current.time.replace('T', ' ');
  }, [current.time]);

  return (
    <GlassCard className="current-weather-hero">
      {/* Top row: Greeting, Local Clock, Favorite */}
      <div className="hero-top-row">
        <div className="hero-top-left">
          <div className="hero-greeting-pill glass-pill">
            <span className="greeting-text">{greetingText}</span>
          </div>

          {localTimeString && (
            <div className="hero-time-pill glass-pill">
              <Clock size={13} className="hero-clock-icon" />
              <span>{localTimeString}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`glass-pill hero-fav-btn ${favorite ? 'fav-active' : ''}`}
          onClick={toggleFav}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={favorite ? 'Saved to favorites' : 'Save to favorites'}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Main 3-Column Weather Showcase */}
      <div className="hero-content-columns">
        {/* Left Column: City, Big Temp, Range */}
        <div className="hero-left-col">
          <div className="hero-location-section">
            <h1 className="hero-city-name" id="selected-city-title">
              {selectedCity.name}
            </h1>
            <p className="hero-city-meta">
              {[selectedCity.admin1, selectedCity.country].filter(Boolean).join(', ')}
            </p>
          </div>

          <div className="hero-temp-wrapper">
            <span className="hero-temp-value temperature-num">
              {formatTemp(current.temperature_2m, tempUnit).replace('°', '')}
            </span>
            <span className="hero-temp-unit">°</span>
          </div>

          <div className="hero-temp-stats-row">
            <div className="hero-stat-pill glass-pill">
              <span className="stat-label">Feels like</span>
              <span className="stat-value">{formatTemp(current.apparent_temperature, tempUnit)}</span>
            </div>

            {highTemp !== undefined && lowTemp !== undefined && (
              <div className="hero-stat-pill glass-pill">
                <span className="high-low-stat">
                  <ArrowUp size={13} className="arrow-high" />
                  <span>{formatTemp(highTemp, tempUnit)}</span>
                </span>
                <span className="high-low-divider">/</span>
                <span className="high-low-stat">
                  <ArrowDown size={13} className="arrow-low" />
                  <span>{formatTemp(lowTemp, tempUnit)}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Large Condition Artwork */}
        <div className="hero-center-col">
          <div className="condition-art-wrap">
            <div className="condition-icon-halo">
              <WeatherIcon
                name={weatherInfo.activeIcon}
                size={70}
                className="hero-weather-icon-large"
                glow
              />
            </div>
            <div className="condition-text-box">
              <span className="hero-condition-desc-large">{weatherInfo.description}</span>
              <span className="condition-subphrase">
                {current.is_day ? 'Daytime' : 'Nighttime'} • {rainChance > 40 ? `${rainChance}% rain chance` : 'Stable conditions'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Telemetry Matrix */}
        <div className="hero-right-col">
          <div className="telemetry-grid">
            {/* Air Quality Pill */}
            <div className="telemetry-chip glass-pill">
              <div className="chip-label-row">
                <span className="chip-label">Air Quality</span>
                <span
                  className="chip-badge"
                  style={{ color: aqiInfo.color, borderColor: aqiInfo.color }}
                >
                  {aqiInfo.label}
                </span>
              </div>
              <span className="chip-val" style={{ color: aqiInfo.color }}>
                {aqiVal !== undefined ? `AQI ${Math.round(aqiVal)}` : 'AQI --'}
              </span>
            </div>

            {/* Wind Pill */}
            <div className="telemetry-chip glass-pill">
              <div className="chip-label-row">
                <span className="chip-label">Wind</span>
                <Wind size={13} className="chip-icon" />
              </div>
              <div className="chip-val-row">
                <span className="chip-val">{formatWind(current.wind_speed_10m, windUnit)}</span>
                <span className="chip-subval">{windDir}</span>
              </div>
            </div>

            {/* Humidity Pill */}
            <div className="telemetry-chip glass-pill">
              <div className="chip-label-row">
                <span className="chip-label">Humidity</span>
                <Droplets size={13} className="chip-icon" />
              </div>
              <span className="chip-val">{current.relative_humidity_2m}%</span>
            </div>

            {/* UV Index Pill */}
            <div className="telemetry-chip glass-pill">
              <div className="chip-label-row">
                <span className="chip-label">UV Index</span>
                <Sun size={13} className="chip-icon" />
              </div>
              <span className="chip-val">
                {uvMax.toFixed(1)} <span className="chip-subval">({uvCategory.level})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
