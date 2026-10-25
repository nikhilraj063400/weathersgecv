import React from 'react';
import {
  Sun,
  SunDim,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Moon
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  SunDim,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Moon
};

export function WeatherIcon({ name = 'CloudSun', size = 24, className = '', glow = false }) {
  const IconComponent = ICON_MAP[name] || CloudSun;

  return (
    <div className={`weather-icon-wrapper ${glow ? 'icon-glow' : ''} ${className}`}>
      <IconComponent size={size} />
    </div>
  );
}
