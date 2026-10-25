import React, { useMemo } from 'react';
import { UserProvider } from './context/UserContext';
import { CityProvider, useCity } from './context/CityContext';
import { useWeather } from './hooks/useWeather';
import { calculateTimePhase } from './utils/timePhase';
import { TIME_PHASES } from './constants/config';
import { SkyBackground } from './components/layout/SkyBackground';
import { CloudCanvas } from './components/layout/CloudCanvas';
import { Header } from './components/layout/Header';
import { QuickCitiesBar } from './components/layout/QuickCitiesBar';
import { CurrentWeather } from './components/weather/CurrentWeather';
import { HourlyForecast } from './components/weather/HourlyForecast';
import { DailyForecast } from './components/weather/DailyForecast';
import { DetailsGrid } from './components/weather/DetailsGrid';
import { AirQualityCard } from './components/weather/AirQualityCard';
import { WeatherTips } from './components/weather/WeatherTips';
import { NameModal } from './components/ui/NameModal';
import { WeatherSkeleton } from './components/ui/Skeleton';
import { ErrorCard } from './components/ui/ErrorCard';
import './styles/tokens.css';
import './styles/glass.css';
import './styles/global.css';
import './App.css';

function WeatherDashboard() {
  const { selectedCity } = useCity();
  const { weather, isLoading, error, refetch } = useWeather(selectedCity);

  // Compute local city time phase (dawn, morning, afternoon, golden, dusk, night)
  const timePhase = useMemo(() => {
    if (!weather || !weather.current) return TIME_PHASES.AFTERNOON;

    const currentTime = weather.current.time;
    const sunrise = weather.daily?.sunrise?.[0];
    const sunset = weather.daily?.sunset?.[0];
    const isDay = weather.current.is_day;

    return calculateTimePhase(currentTime, sunrise, sunset, isDay);
  }, [weather]);

  const currentWeatherCode = weather?.current?.weather_code || 0;
  const cloudCover = weather?.current?.cloud_cover ?? 40;
  const windSpeed = weather?.current?.wind_speed_10m ?? 10;
  const windDirection = weather?.current?.wind_direction_10m ?? 240;

  return (
    <>
      {/* 1. Dynamic Fullscreen Sky Background with crossfading & weather effects */}
      <SkyBackground phase={timePhase} weatherCode={currentWeatherCode} />

      {/* 2. Interactive Parallax Cloud System with pointer wind physics */}
      <CloudCanvas
        cloudCover={cloudCover}
        windSpeed={windSpeed}
        windDirection={windDirection}
        timePhase={timePhase}
        weatherCode={currentWeatherCode}
      />

      {/* 3. Subtle Window Glass Vignette */}
      <div className="window-vignette" aria-hidden="true" />

      {/* 4. Glass Interface Container */}
      <div className="app-container">
        <Header />
        <QuickCitiesBar />

        <main className="content-wrapper" id="main-content">
          {isLoading && !weather ? (
            <WeatherSkeleton />
          ) : error && !weather ? (
            <ErrorCard message={error} onRetry={refetch} />
          ) : weather ? (
            <div className="dashboard-flow">
              {/* 1. Redesigned Rich Hero Section with 3-column telemetry & condition showcase */}
              <CurrentWeather
                current={weather.current}
                daily={weather.daily}
                timePhase={timePhase}
                airQuality={weather.airQuality}
                timezone={weather.timezone}
              />

              {/* 2. Full-Width 24-Hour Forecast with wheel & drag scrolling */}
              <HourlyForecast
                hourly={weather.hourly}
                currentTime={weather.current.time}
              />

              {/* 3. Balanced Lower Section */}
              <div className="lower-grid">
                {/* Left: 7-Day Forecast & Smart Weather Tips */}
                <div className="column-stack">
                  <DailyForecast daily={weather.daily} />
                  <WeatherTips
                    current={weather.current}
                    daily={weather.daily}
                  />
                </div>

                {/* Right: Live Air Quality & Comprehensive Meteorological Details */}
                <div className="column-stack">
                  <AirQualityCard airQuality={weather.airQuality} />
                  <DetailsGrid current={weather.current} daily={weather.daily} />
                </div>
              </div>
            </div>
          ) : null}
        </main>

        <footer className="app-footer">
          <p className="footer-credits">
            Powered by Open-Meteo Weather & Air Quality APIs • Living Glass Window Experience
          </p>
        </footer>
      </div>

      {/* 5. First-visit Welcome & User Name Modal */}
      <NameModal />
    </>
  );
}

export default function App() {
  return (
    <UserProvider>
      <CityProvider>
        <WeatherDashboard />
      </CityProvider>
    </UserProvider>
  );
}
