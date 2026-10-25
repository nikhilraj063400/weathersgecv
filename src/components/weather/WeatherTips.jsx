import React, { useMemo } from 'react';
import { Umbrella, ShieldAlert, Sparkles, Wind, Snowflake, Sun } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import './WeatherTips.css';

export function WeatherTips({ current, daily }) {
  const tip = useMemo(() => {
    if (!current || !daily) return null;

    const code = current.weather_code;
    const uvMax = daily.uv_index_max?.[0] || 0;
    const rainChance = daily.precipitation_probability_max?.[0] || 0;
    const windSpeed = current.wind_speed_10m || 0;

    // Rain / Storm
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code) || rainChance >= 60) {
      return {
        icon: Umbrella,
        title: 'Rain Expected',
        message: 'Carry an umbrella today. Rain showers are active or likely in the forecast.',
        color: 'var(--accent-cyan)'
      };
    }

    // High UV
    if (uvMax >= 7) {
      return {
        icon: Sun,
        title: 'High UV Radiation',
        message: `Peak UV is ${uvMax.toFixed(1)}. Wear UV-rated sunglasses and apply sunscreen.`,
        color: 'var(--accent-amber)'
      };
    }

    // High Wind
    if (windSpeed >= 35) {
      return {
        icon: Wind,
        title: 'High Wind Advisory',
        message: `Brisk winds up to ${Math.round(windSpeed)} km/h. Secure loose outdoor items.`,
        color: 'var(--accent-cyan)'
      };
    }

    // Snow / Freezing
    if ([71, 73, 75, 77, 85, 86, 56, 57, 66, 67].includes(code)) {
      return {
        icon: Snowflake,
        title: 'Freezing Conditions',
        message: 'Freezing precipitation or snowfall. Watch for icy surfaces and bundle up.',
        color: '#dff9fb'
      };
    }

    // Pleasant
    return {
      icon: Sparkles,
      title: 'Comfortable Atmosphere',
      message: 'Great conditions outdoors today. Ideal weather for a walk or exploring.',
      color: 'var(--accent-cyan)'
    };
  }, [current, daily]);

  if (!tip) return null;

  const IconComp = tip.icon;

  return (
    <GlassCard className="weather-tips-card">
      <div className="tip-icon-box" style={{ color: tip.color, borderColor: tip.color }}>
        <IconComp size={20} />
      </div>
      <div className="tip-content">
        <h3 className="tip-title">{tip.title}</h3>
        <p className="tip-message">{tip.message}</p>
      </div>
    </GlassCard>
  );
}
