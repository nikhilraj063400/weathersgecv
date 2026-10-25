import React from 'react';
import { Wind, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { getAqiCategory } from '../../services/airQualityApi';
import './AirQualityCard.css';

export function AirQualityCard({ airQuality }) {
  if (!airQuality) return null;

  const aqi = airQuality.us_aqi;
  const category = getAqiCategory(aqi);

  // AQI progress percentage (0 to 300 scale)
  const progressPercent = Math.min(100, Math.max(5, ((aqi || 0) / 300) * 100));

  return (
    <GlassCard className="aqi-card">
      <div className="aqi-header">
        <div className="aqi-title-wrap">
          <Wind size={18} className="aqi-icon" />
          <h3 className="aqi-title">Air Quality Index (AQI)</h3>
        </div>
        <span
          className="aqi-badge glass-pill"
          style={{
            borderColor: category.color,
            color: category.color,
            backgroundColor: category.bg
          }}
        >
          {category.label}
        </span>
      </div>

      <div className="aqi-main-row">
        <div className="aqi-score-box">
          <span className="aqi-score-num temperature-num" style={{ color: category.color }}>
            {aqi !== undefined ? Math.round(aqi) : '--'}
          </span>
          <span className="aqi-score-sub">US AQI</span>
        </div>

        <div className="aqi-progress-col">
          <div className="aqi-track">
            <div
              className="aqi-fill"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, #55efc4, #ffd166, #ff7675, #a29bfe)`
              }}
            />
            <div
              className="aqi-marker"
              style={{
                left: `${progressPercent}%`,
                backgroundColor: category.color,
                boxShadow: `0 0 10px ${category.color}`
              }}
            />
          </div>
          <p className="aqi-advice">{category.advice}</p>
        </div>
      </div>

      {/* Pollutants Breakdown */}
      <div className="aqi-pollutants-grid">
        <div className="pollutant-item">
          <span className="pollutant-label">PM2.5</span>
          <span className="pollutant-val">
            {airQuality.pm2_5 !== undefined ? `${Math.round(airQuality.pm2_5)} μg/m³` : '--'}
          </span>
        </div>
        <div className="pollutant-item">
          <span className="pollutant-label">PM10</span>
          <span className="pollutant-val">
            {airQuality.pm10 !== undefined ? `${Math.round(airQuality.pm10)} μg/m³` : '--'}
          </span>
        </div>
        <div className="pollutant-item">
          <span className="pollutant-label">Ozone (O₃)</span>
          <span className="pollutant-val">
            {airQuality.ozone !== undefined ? `${Math.round(airQuality.ozone)} μg/m³` : '--'}
          </span>
        </div>
        <div className="pollutant-item">
          <span className="pollutant-label">NO₂</span>
          <span className="pollutant-val">
            {airQuality.nitrogen_dioxide !== undefined ? `${Math.round(airQuality.nitrogen_dioxide)} μg/m³` : '--'}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
