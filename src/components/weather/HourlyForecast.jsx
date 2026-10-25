import React, { useMemo, useRef, useState } from 'react';
import { Clock, Droplets, ChevronLeft, ChevronRight, Wind } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp, formatHour, formatWind } from '../../utils/format';
import { useUser } from '../../context/UserContext';
import './HourlyForecast.css';

export function HourlyForecast({ hourly, currentTime }) {
  const { tempUnit, windUnit } = useUser();
  const scrollRef = useRef(null);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Compute 24 hours starting from the city's current local hour
  const items = useMemo(() => {
    if (!hourly || !hourly.time || !currentTime) return [];

    const currentHourPrefix = currentTime.slice(0, 13); // e.g. "2026-09-19T03"
    let startIndex = hourly.time.findIndex((t) => t.startsWith(currentHourPrefix));

    if (startIndex === -1) {
      startIndex = 0;
    }

    const next24 = [];
    const maxLen = Math.min(hourly.time.length, startIndex + 24);

    for (let i = startIndex; i < maxLen; i++) {
      const timeStr = hourly.time[i];
      const code = hourly.weather_code[i];
      const hourVal = parseInt(timeStr.split('T')[1].split(':')[0], 10);
      const isDay = hourVal >= 6 && hourVal < 19 ? 1 : 0;
      const info = getWeatherInfo(code, isDay);

      next24.push({
        time: timeStr,
        isCurrent: i === startIndex,
        temp: hourly.temperature_2m[i],
        pop: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        wind: hourly.wind_speed_10m ? hourly.wind_speed_10m[i] : 0,
        icon: info.activeIcon,
        description: info.description
      });
    }

    return next24;
  }, [hourly, currentTime]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Enable mouse wheel horizontal scrolling
  const handleWheel = (e) => {
    if (scrollRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Drag-to-scroll mouse handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  if (items.length === 0) return null;

  return (
    <GlassCard className="hourly-card">
      <div className="hourly-header">
        <div className="hourly-title-wrap">
          <Clock size={18} className="hourly-header-icon" />
          <h2 className="hourly-title">24-Hour Forecast</h2>
          <span className="hourly-hint-pill glass-pill">Scroll or drag</span>
        </div>

        <div className="hourly-scroll-btns">
          <button
            type="button"
            className="glass-pill scroll-arrow-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="glass-pill scroll-arrow-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        className={`hourly-strip-container ${isDragging ? 'is-dragging' : ''}`}
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {items.map((item, idx) => (
          <div
            key={`hour-${item.time}-${idx}`}
            className={`hourly-item ${item.isCurrent ? 'hourly-item-active' : ''}`}
          >
            <span className="hour-time">
              {item.isCurrent ? 'Now' : formatHour(item.time)}
            </span>

            <WeatherIcon
              name={item.icon}
              size={28}
              className="hour-icon"
              glow={item.isCurrent}
            />

            <span className="hour-temp temperature-num">
              {formatTemp(item.temp, tempUnit)}
            </span>

            {/* Precipitation badge */}
            <div className={`hour-pop-badge ${item.pop > 15 ? 'has-pop' : ''}`}>
              <Droplets size={11} />
              <span>{item.pop}%</span>
            </div>

            {/* Hourly Wind */}
            <span className="hour-wind">
              {formatWind(item.wind, windUnit)}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
