/**
 * WMO Weather Codes mapping according to Open-Meteo documentation
 */
export const WEATHER_CODES = {
  0: {
    description: 'Clear sky',
    category: 'clear',
    icon: 'Sun',
    nightIcon: 'Moon',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  1: {
    description: 'Mainly clear',
    category: 'mainly_clear',
    icon: 'SunDim',
    nightIcon: 'Moon',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  2: {
    description: 'Partly cloudy',
    category: 'partly_cloudy',
    icon: 'CloudSun',
    nightIcon: 'CloudMoon',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  3: {
    description: 'Overcast',
    category: 'overcast',
    icon: 'Cloud',
    nightIcon: 'Cloud',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  45: {
    description: 'Fog',
    category: 'fog',
    icon: 'CloudFog',
    nightIcon: 'CloudFog',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: true
  },
  48: {
    description: 'Depositing rime fog',
    category: 'fog',
    icon: 'CloudFog',
    nightIcon: 'CloudFog',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: true
  },
  51: {
    description: 'Light drizzle',
    category: 'drizzle',
    icon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  53: {
    description: 'Moderate drizzle',
    category: 'drizzle',
    icon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  55: {
    description: 'Dense drizzle',
    category: 'drizzle',
    icon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  56: {
    description: 'Freezing drizzle',
    category: 'freezing_drizzle',
    icon: 'CloudSnow',
    nightIcon: 'CloudSnow',
    isRain: true,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  57: {
    description: 'Dense freezing drizzle',
    category: 'freezing_drizzle',
    icon: 'CloudSnow',
    nightIcon: 'CloudSnow',
    isRain: true,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  61: {
    description: 'Slight rain',
    category: 'rain',
    icon: 'CloudRain',
    nightIcon: 'CloudRain',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  63: {
    description: 'Moderate rain',
    category: 'rain',
    icon: 'CloudRain',
    nightIcon: 'CloudRain',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  65: {
    description: 'Heavy rain',
    category: 'rain',
    icon: 'CloudRainWind',
    nightIcon: 'CloudRainWind',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  66: {
    description: 'Freezing rain',
    category: 'rain',
    icon: 'CloudSnow',
    nightIcon: 'CloudSnow',
    isRain: true,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  67: {
    description: 'Heavy freezing rain',
    category: 'rain',
    icon: 'CloudSnow',
    nightIcon: 'CloudSnow',
    isRain: true,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  71: {
    description: 'Slight snow fall',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  73: {
    description: 'Moderate snow fall',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  75: {
    description: 'Heavy snow fall',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  77: {
    description: 'Snow grains',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  80: {
    description: 'Slight rain showers',
    category: 'rain',
    icon: 'CloudRain',
    nightIcon: 'CloudRain',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  81: {
    description: 'Moderate rain showers',
    category: 'rain',
    icon: 'CloudRain',
    nightIcon: 'CloudRain',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  82: {
    description: 'Violent rain showers',
    category: 'rain',
    icon: 'CloudRainWind',
    nightIcon: 'CloudRainWind',
    isRain: true,
    isSnow: false,
    isThunder: false,
    isFog: false
  },
  85: {
    description: 'Slight snow showers',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  86: {
    description: 'Heavy snow showers',
    category: 'snow',
    icon: 'Snowflake',
    nightIcon: 'Snowflake',
    isRain: false,
    isSnow: true,
    isThunder: false,
    isFog: false
  },
  95: {
    description: 'Thunderstorm',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    nightIcon: 'CloudLightning',
    isRain: true,
    isSnow: false,
    isThunder: true,
    isFog: false
  },
  96: {
    description: 'Thunderstorm with hail',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    nightIcon: 'CloudLightning',
    isRain: true,
    isSnow: true,
    isThunder: true,
    isFog: false
  },
  99: {
    description: 'Heavy thunderstorm with hail',
    category: 'thunderstorm',
    icon: 'CloudLightning',
    nightIcon: 'CloudLightning',
    isRain: true,
    isSnow: true,
    isThunder: true,
    isFog: false
  }
};

/**
 * Returns weather info for a code with safe fallback
 */
export function getWeatherInfo(code, isDay = 1) {
  const info = WEATHER_CODES[code] || {
    description: 'Partly cloudy',
    category: 'partly_cloudy',
    icon: 'CloudSun',
    nightIcon: 'CloudMoon',
    isRain: false,
    isSnow: false,
    isThunder: false,
    isFog: false
  };

  return {
    ...info,
    activeIcon: isDay ? info.icon : info.nightIcon
  };
}
