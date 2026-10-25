import React, { useMemo } from 'react';
import { Calendar, Droplets } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../../utils/weatherCodes';
import { formatTemp, formatDayName } from '../../utils/format';
import { useUser } from '../../context/UserContext';
import './DailyForecast.css';

export function DailyForecast({ daily }) {
  const { tempUnit } = useUser();

  const { days, globalMin, globalMax } = useMemo(() => {
    if (!daily || !daily.time) return { days: [], globalMin: 0, globalMax: 100 };

    let gMin = Infinity;
    let gMax = -Infinity;

    const list = [];
    const count = Math.min(daily.time.length, 7);

    for (let i = 0; i < count; i++) {
      const minVal = daily.temperature_2m_min[i];
      const maxVal = daily.temperature_2m_max[i];
      if (minVal < gMin) gMin = minVal;
      if (maxVal > gMax) gMax = maxVal;

      const code = daily.weather_code[i];
      const info = getWeatherInfo(code, 1);
      const pop = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

      list.push({
        date: daily.time[i],
        dayName: formatDayName(daily.time[i], i),
        icon: info.icon,
        description: info.description,
        min: minVal,
        max: maxVal,
        pop
      });
    }

    return { days: list, globalMin: gMin, globalMax: gMax };
  }, [daily]);

  if (days.length === 0) return null;

  const totalRange = Math.max(globalMax - globalMin, 1);

  return (
    <GlassCard className="daily-forecast-card">
      <div className="daily-header">
        <Calendar size={16} className="daily-header-icon" />
        <h2 className="daily-title">7-Day Forecast</h2>
      </div>

      <div className="daily-rows-list">
        {days.map((d, idx) => {
          const leftPercent = Math.max(0, Math.min(95, ((d.min - globalMin) / totalRange) * 100));
          const widthPercent = Math.max(5, Math.min(100 - leftPercent, ((d.max - d.min) / totalRange) * 100));

          return (
            <div key={`day-${d.date}-${idx}`} className="daily-row">
              <span className="day-name">{d.dayName}</span>

              <div className="day-icon-pop">
                <WeatherIcon name={d.icon} size={22} className="day-icon" />
                {d.pop > 10 ? (
                  <span className="day-pop-text">
                    <Droplets size={10} />
                    {d.pop}%
                  </span>
                ) : (
                  <span className="day-pop-placeholder" />
                )}
              </div>

              {/* Min Temp */}
              <span className="day-temp-min temperature-num">
                {formatTemp(d.min, tempUnit)}
              </span>

              {/* Range Bar */}
              <div className="range-bar-track">
                <div
                  className="range-bar-fill"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              </div>

              {/* Max Temp */}
              <span className="day-temp-max temperature-num">
                {formatTemp(d.max, tempUnit)}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
