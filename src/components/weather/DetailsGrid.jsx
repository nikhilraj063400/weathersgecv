import React from 'react';
import { Wind, Droplets, Sun, Gauge, Cloud, Eye, Navigation2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { SunArc } from './SunArc';
import { formatWind, formatPressure, getWindDirection, getUvCategory } from '../../utils/format';
import { useUser } from '../../context/UserContext';
import './DetailsGrid.css';

export function DetailsGrid({ current, daily }) {
  const { windUnit } = useUser();

  if (!current || !daily) return null;

  const windDirName = getWindDirection(current.wind_direction_10m);
  const uvMax = daily.uv_index_max?.[0] || 0;
  const uvCategory = getUvCategory(uvMax);
  const sunriseIso = daily.sunrise?.[0];
  const sunsetIso = daily.sunset?.[0];

  return (
    <div className="details-grid-container">
      {/* Sun Arc Card */}
      <GlassCard className="detail-card detail-card-wide">
        <SunArc
          sunriseIso={sunriseIso}
          sunsetIso={sunsetIso}
          currentTimeIso={current.time}
        />
      </GlassCard>

      {/* Wind Card with animated rotating compass */}
      <GlassCard className="detail-card">
        <div className="detail-card-header">
          <Wind size={16} className="detail-icon" />
          <span className="detail-label">Wind & Direction</span>
        </div>
        <div className="detail-main-stat">
          <span className="detail-stat-val">{formatWind(current.wind_speed_10m, windUnit)}</span>
        </div>
        <div className="wind-compass-row">
          <div
            className="compass-needle-wrap"
            style={{ transform: `rotate(${current.wind_direction_10m || 0}deg)` }}
          >
            <Navigation2 size={20} className="compass-needle-icon" />
          </div>
          <span className="compass-text">
            {windDirName} ({current.wind_direction_10m || 0}°)
          </span>
        </div>
      </GlassCard>

      {/* Humidity Card */}
      <GlassCard className="detail-card">
        <div className="detail-card-header">
          <Droplets size={16} className="detail-icon" />
          <span className="detail-label">Humidity</span>
        </div>
        <div className="detail-main-stat">
          <span className="detail-stat-val">{current.relative_humidity_2m}%</span>
        </div>
        <p className="detail-subtext">
          {current.relative_humidity_2m > 70
            ? 'Humid and moist conditions'
            : current.relative_humidity_2m < 30
            ? 'Dry atmospheric air'
            : 'Comfortable relative humidity'}
        </p>
      </GlassCard>

      {/* UV Index Card */}
      <GlassCard className="detail-card">
        <div className="detail-card-header">
          <Sun size={16} className="detail-icon" />
          <span className="detail-label">UV Index</span>
        </div>
        <div className="detail-main-stat">
          <span className="detail-stat-val">{uvMax.toFixed(1)}</span>
          <span
            className="uv-badge glass-pill"
            style={{ borderColor: uvCategory.color, color: uvCategory.color }}
          >
            {uvCategory.level}
          </span>
        </div>
        <p className="detail-subtext">
          {uvMax >= 6 ? 'Sun protection required' : 'Low danger for average person'}
        </p>
      </GlassCard>

      {/* Air Pressure Card */}
      <GlassCard className="detail-card">
        <div className="detail-card-header">
          <Gauge size={16} className="detail-icon" />
          <span className="detail-label">Pressure</span>
        </div>
        <div className="detail-main-stat">
          <span className="detail-stat-val">{formatPressure(current.pressure_msl)}</span>
        </div>
        <p className="detail-subtext">
          {current.pressure_msl > 1013 ? 'High pressure system' : 'Low pressure atmospheric system'}
        </p>
      </GlassCard>

      {/* Cloud Cover Card */}
      <GlassCard className="detail-card">
        <div className="detail-card-header">
          <Cloud size={16} className="detail-icon" />
          <span className="detail-label">Cloud Cover</span>
        </div>
        <div className="detail-main-stat">
          <span className="detail-stat-val">{current.cloud_cover}%</span>
        </div>
        <div className="cloud-progress-track">
          <div
            className="cloud-progress-fill"
            style={{ width: `${current.cloud_cover}%` }}
          />
        </div>
      </GlassCard>
    </div>
  );
}
