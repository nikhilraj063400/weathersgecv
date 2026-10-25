import React, { useMemo } from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { formatSunTime } from '../../utils/format';
import './SunArc.css';

export function SunArc({ sunriseIso, sunsetIso, currentTimeIso }) {
  const { progress, isDay, daylightDuration, sunriseTime, sunsetTime } = useMemo(() => {
    if (!sunriseIso || !sunsetIso) {
      return { progress: 0.5, isDay: true, daylightDuration: '--', sunriseTime: '--:--', sunsetTime: '--:--' };
    }

    const parseToMin = (iso) => {
      const timePart = iso.includes('T') ? iso.split('T')[1] : iso;
      const [h, m] = timePart.split(':');
      return parseInt(h, 10) * 60 + parseInt(m || '0', 10);
    };

    const riseMin = parseToMin(sunriseIso);
    const setMin = parseToMin(sunsetIso);
    const nowMin = currentTimeIso ? parseToMin(currentTimeIso) : riseMin + 120;

    const totalDaylightMin = Math.max(1, setMin - riseMin);
    const hours = Math.floor(totalDaylightMin / 60);
    const mins = totalDaylightMin % 60;
    const durationStr = `${hours}h ${mins}m`;

    let prog = 0;
    let day = true;

    if (nowMin < riseMin) {
      prog = 0;
      day = false;
    } else if (nowMin > setMin) {
      prog = 1;
      day = false;
    } else {
      prog = (nowMin - riseMin) / totalDaylightMin;
      day = true;
    }

    return {
      progress: Math.max(0, Math.min(1, prog)),
      isDay: day,
      daylightDuration: durationStr,
      sunriseTime: formatSunTime(sunriseIso),
      sunsetTime: formatSunTime(sunsetIso)
    };
  }, [sunriseIso, sunsetIso, currentTimeIso]);

  // Compute point on quadratic curve: P(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  // P0 = (20, 75), P1 = (110, 15), P2 = (200, 75)
  const t = progress;
  const sunX = Math.round((1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 110 + t * t * 200);
  const sunY = Math.round((1 - t) * (1 - t) * 75 + 2 * (1 - t) * t * 15 + t * t * 75);

  return (
    <div className="sun-arc-widget">
      <div className="sun-arc-meta">
        <span className="sun-arc-label">Solar Trajectory</span>
        <span className="daylight-pill glass-pill">{daylightDuration} daylight</span>
      </div>

      <div className="sun-arc-svg-wrap">
        <svg viewBox="0 0 220 90" className="sun-arc-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--accent-amber)" stop-opacity="0.8"/>
              <stop offset="50%" stop-color="var(--accent-cyan)" stop-opacity="1"/>
              <stop offset="100%" stop-color="#ff7675" stop-opacity="0.8"/>
            </linearGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="40%" stop-color="#ffeaa7"/>
              <stop offset="100%" stop-color="#ff9f43" stop-opacity="0"/>
            </radialGradient>
          </defs>

          {/* Horizon Line */}
          <line x1="10" y1="75" x2="210" y2="75" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3"/>

          {/* Dotted Arch Path */}
          <path
            d="M 20 75 Q 110 15 200 75"
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Traversed Sun Arc Highlight */}
          <path
            d="M 20 75 Q 110 15 200 75"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2.5"
            strokeDasharray="220"
            strokeDashoffset={220 * (1 - progress)}
          />

          {/* Animated Sun Orb */}
          <circle
            cx={sunX}
            cy={sunY}
            r="9"
            fill="url(#sunGlow)"
            className="sun-orb-halo"
          />
          <circle
            cx={sunX}
            cy={sunY}
            r="4.5"
            fill="#ffffff"
            className="sun-orb-core"
          />
        </svg>
      </div>

      <div className="sun-times-row">
        <div className="sun-time-item">
          <Sunrise size={16} className="sunrise-icon" />
          <div className="time-text-col">
            <span className="time-name">Sunrise</span>
            <span className="time-val">{sunriseTime}</span>
          </div>
        </div>

        <div className="sun-time-item item-sunset">
          <Sunset size={16} className="sunset-icon" />
          <div className="time-text-col">
            <span className="time-name">Sunset</span>
            <span className="time-val">{sunsetTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
